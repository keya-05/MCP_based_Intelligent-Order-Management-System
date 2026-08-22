CREATE TABLE IF NOT EXISTS menu (
  pizza_id INT NOT NULL AUTO_INCREMENT,
  pizza_name VARCHAR(20) DEFAULT NULL,
  price DECIMAL(10,2) DEFAULT NULL,
  PRIMARY KEY (pizza_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO menu (pizza_name, price) VALUES
  ('margherita', 12.00),
  ('pepperoni', 15.00),
  ('veggie', 14.50),
  ('bbq chicken', 18.00);
