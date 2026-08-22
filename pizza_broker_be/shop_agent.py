#runs on Port 8000 and waits for questions.

from fastapi import FastAPI, Request
from pydantic import BaseModel
import uvicorn
from shop_tools import check_price_logic
from fastapi.middleware.cors import CORSMiddleware
from shop_tools import get_menu_items
from llm_agent import ask_llm
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

app=FastAPI(title="Pizza Shop Agent")

# Rate limiting: keyed by client IP since there's no auth/user identity yet.
# Keeps one person from hammering the endpoint and (once the LLM is wired in)
# burning through the shared Google AI Studio free-tier quota for everyone.
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

#CORS, so that FE can trust BE
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (good for development)
    allow_credentials=True,
    allow_methods=["POST", "GET"],  #if all -> *
    allow_headers=["*"],  # Allows all headers
)

PRICE_KEYWORDS = ("price", "cost", "how much", "rate", "₹")

#---- the brain -----
class ShopBrain:

    def process_order(self, order_text):
        print(f" ShopBrain processing: '{order_text}'")

        text = order_text.lower()
        is_price_query = any(kw in text for kw in PRICE_KEYWORDS)

        if is_price_query:
            menu_items = get_menu_items()
            for item in menu_items:
                if item in text:
                    print("   ↳ Direct price match: using tool check_price")
                    return check_price_logic(item)

        print("   ↳ No direct price match, falling back to LLM")
        return ask_llm(order_text)

agent = ShopBrain()

#-----A2A communication -----
class AgentMessage(BaseModel):
    sender:str
    content:str


@app.get("/health")
async def health():
    return {"status": "online"}

@app.post("/a2a/message")
@limiter.limit("5/minute")
async def receive_message(request: Request, msg: AgentMessage):
    print(f"\n📞 A2A CALL from {msg.sender}")
    response_text = agent.process_order(msg.content)
    return {"sender": "ShopAgent", "content": response_text}

if __name__ == "__main__":
    print("🟢 Shop Agent is ONLINE on Port 8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)