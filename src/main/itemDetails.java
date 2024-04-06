package src.main;

public class itemDetails {
    static class ItemDetails {
        private int quantity;
        private String expirationDate;

        public ItemDetails(int quantity, String expirationDate) {
            this.quantity = quantity;
            this.expirationDate = expirationDate;
        }

        // Getters and setters
        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }

        public String getExpirationDate() {
            return expirationDate;
        }

        public void setExpirationDate(String expirationDate) {
            this.expirationDate = expirationDate;
        }
    }
}
