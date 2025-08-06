import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  InputAdornment,
} from "@mui/material";
import {
  Add,
  Remove,
  Delete,
  Search,
  ShoppingCart,
  Payment,
  Receipt,
  Clear,
} from "@mui/icons-material";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  sku: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  sku: string;
  stock: number;
}

const POS: React.FC = () => {
  // Mock products
  const mockProducts: Product[] = [
    {
      id: "1",
      name: "Wireless Headphones",
      price: 199.99,
      sku: "WH-001",
      stock: 45,
    },
    { id: "2", name: "Smart Watch", price: 299.99, sku: "SW-002", stock: 23 },
    { id: "3", name: "Phone Case", price: 19.99, sku: "PC-003", stock: 156 },
    {
      id: "4",
      name: "Bluetooth Speaker",
      price: 89.99,
      sku: "BS-004",
      stock: 78,
    },
    { id: "5", name: "USB Cable", price: 12.99, sku: "UC-005", stock: 234 },
    { id: "6", name: "Power Bank", price: 49.99, sku: "PB-006", stock: 67 },
  ];

  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [discount, setDiscount] = useState(0);

  const filteredProducts = mockProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          sku: product.sku,
        },
      ]);
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart(
      cart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setCustomerName("");
    setDiscount(0);
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountAmount = subtotal * (discount / 100);
  const tax = (subtotal - discountAmount) * 0.08; // 8% tax
  const total = subtotal - discountAmount + tax;

  const handleCheckout = () => {
    if (cart.length === 0) return;

    console.log("Processing checkout:", {
      cart,
      customerName,
      paymentMethod,
      subtotal,
      discount,
      tax,
      total,
    });

    // Simulate checkout process
    alert("Order processed successfully!");
    clearCart();
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Point of Sale
      </Typography>

      <Grid container spacing={3}>
        {/* Product Search and Selection */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <TextField
                fullWidth
                placeholder="Search products by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <Grid container spacing={2}>
                {filteredProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product.id}>
                    <Card
                      sx={{
                        cursor: "pointer",
                        "&:hover": { bgcolor: "action.hover" },
                      }}
                      onClick={() => addToCart(product)}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          SKU: {product.sku}
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                          ${product.price.toFixed(2)}
                        </Typography>
                        <Chip
                          label={`Stock: ${product.stock}`}
                          size="small"
                          color={product.stock > 10 ? "success" : "warning"}
                          sx={{ mt: 1 }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Cart and Checkout */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Typography variant="h6">
                  <ShoppingCart sx={{ mr: 1, verticalAlign: "bottom" }} />
                  Shopping Cart
                </Typography>
                <Button
                  size="small"
                  onClick={clearCart}
                  disabled={cart.length === 0}
                  startIcon={<Clear />}
                >
                  Clear
                </Button>
              </Box>

              {cart.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                  sx={{ py: 4 }}
                >
                  Cart is empty. Add products to get started.
                </Typography>
              ) : (
                <List dense>
                  {cart.map((item) => (
                    <ListItem key={item.id} sx={{ px: 0 }}>
                      <ListItemText
                        primary={item.name}
                        secondary={`$${item.price.toFixed(2)} × ${item.quantity}`}
                      />
                      <ListItemSecondaryAction>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <IconButton
                            size="small"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            <Remove />
                          </IconButton>
                          <Typography
                            variant="body2"
                            sx={{ minWidth: 20, textAlign: "center" }}
                          >
                            {item.quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Add />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}

              {cart.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />

                  {/* Customer and Discount */}
                  <TextField
                    fullWidth
                    label="Customer Name (Optional)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Discount (%)"
                    type="number"
                    value={discount}
                    onChange={(e) =>
                      setDiscount(
                        Math.max(0, Math.min(100, Number(e.target.value)))
                      )
                    }
                    sx={{ mb: 2 }}
                  />

                  {/* Order Summary */}
                  <Box sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">Subtotal:</Typography>
                      <Typography variant="body2">
                        ${subtotal.toFixed(2)}
                      </Typography>
                    </Box>
                    {discount > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2" color="success.main">
                          Discount ({discount}%):
                        </Typography>
                        <Typography variant="body2" color="success.main">
                          -${discountAmount.toFixed(2)}
                        </Typography>
                      </Box>
                    )}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">Tax (8%):</Typography>
                      <Typography variant="body2">${tax.toFixed(2)}</Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="h6" fontWeight="bold">
                        Total:
                      </Typography>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        color="primary"
                      >
                        ${total.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Payment Method */}
                  <TextField
                    fullWidth
                    select
                    label="Payment Method"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    sx={{ mb: 2 }}
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Credit/Debit Card</option>
                    <option value="mobile">Mobile Payment</option>
                  </TextField>

                  {/* Checkout Button */}
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleCheckout}
                    startIcon={<Payment />}
                    sx={{ mb: 1 }}
                  >
                    Complete Sale
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    startIcon={<Receipt />}
                    onClick={() => console.log("Print receipt")}
                  >
                    Print Receipt
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default POS;
