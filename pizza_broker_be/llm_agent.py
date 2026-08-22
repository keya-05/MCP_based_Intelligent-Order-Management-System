#Falls back to Gemini when the keyword matcher in shop_agent.py can't
#figure out what the customer meant. Reuses the same tool functions as
#shop_tools.py so the LLM can only answer from real menu/price data.

import os
import datetime
from dotenv import load_dotenv
from google import genai
from google.genai import types

from shop_tools import get_menu_items, check_price_logic

load_dotenv()

MODEL_NAME = "gemini-3.6-flash"

# Google's free tier caps this whole project at 20 LLM requests/day, shared
# across every user. Stop a few short of that so we fail gracefully with our
# own message instead of hitting Google's hard 429 mid-conversation.
DAILY_LLM_BUDGET = 15
_budget_date = None
_budget_used = 0


def _budget_available() -> bool:
    global _budget_date, _budget_used
    today = datetime.date.today()
    if _budget_date != today:
        _budget_date = today
        _budget_used = 0
    if _budget_used >= DAILY_LLM_BUDGET:
        return False
    _budget_used += 1
    return True

SYSTEM_INSTRUCTION = (
    "You are PizzaBot, a friendly assistant for a pizza shop. "
    "Use the available tools to look up menu items and prices before answering. "
    "Only answer questions about the shop's menu and prices. "
    "If you don't know the answer, or the question isn't about the menu, "
    "say so plainly instead of guessing. "
    "If a message contains more than one question, answer every part of it — "
    "never reply with only a tool's raw output while ignoring the rest of what was asked. "
    "All prices are in Indian Rupees; always use the ₹ symbol, never $ or any other currency."
)

_client = None


def _get_client():
    global _client
    if _client is None:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError("GEMINI_API_KEY is not set")
        _client = genai.Client(api_key=api_key)
    return _client


def ask_llm(user_text: str) -> str:
    """Ask Gemini to interpret a free-form customer message using the shop's tools.

    Returns a plain-text reply, or a graceful fallback message if the call
    fails for any reason (missing key, quota exhausted, network error, etc.)
    so a shared free-tier outage never surfaces as a crash to the user.
    """
    if not _budget_available():
        return "I've reached today's limit for smart answers. Please ask about a specific menu item, or try again tomorrow!"

    try:
        client = _get_client()
        chat = client.chats.create(
            model=MODEL_NAME,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTION,
                tools=[get_menu_items, check_price_logic],
                temperature=0.2,
            ),
        )
        response = chat.send_message(user_text)
        text = response.text.strip() if response.text else ""
        return text or "I didn't understand. Please ask about our menu items."
    except Exception as e:
        print(f"LLM error: {e}")
        return "I'm having trouble understanding right now. Please try asking about a specific menu item."
