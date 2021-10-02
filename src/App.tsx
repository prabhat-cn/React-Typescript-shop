import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
// Components
import Drawer from '@material-ui/core/Drawer'
import LinearProgress from '@material-ui/core/LinearProgress'
import Grid from '@material-ui/core/Grid'
import AddShoppingCart from '@material-ui/icons/AddShoppingCart'
import Badge from '@material-ui/core/Badge'
// Styled
import { Wrapper, StyledButton } from './App.styles'
import Items from './Item/Items'
import Cart from './Cart/Cart'

// Types
export type CartItemType = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  // my needed property
  amount: number;
}

const getProducts = async (): Promise<CartItemType[]> => await (await fetch('https://fakestoreapi.com/products')).json()

const App = () => {

  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([] as CartItemType[]);

  const cartClose = () => setCartOpen(false);
  const cartOpenClick = () => setCartOpen(true);

  const { data, isLoading, error } = useQuery<CartItemType[]>('products', getProducts) //('querykey', function)
  console.log('getProducts', data);

  const getTotalItems = (items: CartItemType[]) =>
    // ascending {ack=accumulator}; o -> initial
    items.reduce((ack: number, item) => ack + item.amount, 0);

  // const handleAddToCart = (clickedItem: CartItemType) => null;
  const handleAddToCart = (clickedItem: CartItemType) => {
    setCartItems(prev => {
      // 1. Is the item already added in the cart?
      const isItemInCart = prev.find(item => item.id === clickedItem.id);
      if (isItemInCart) {
        return prev.map(item => (
          item.id === clickedItem.id ? { ...item, amount: item.amount + 1 } : item
        ))
      }


      // 2. First time the item is added
      return [...prev, { ...clickedItem, amount: 1 }]

    });
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems(prev =>
      prev.reduce((ack, item) => {
        if (item.id === id) {
          if (item.amount === 1) return ack;
          return [...ack, { ...item, amount: item.amount - 1 }]
        } else {
          return [...ack, item];
        }
      }, [] as CartItemType[])

    );
  };

  if (isLoading) {
    return <LinearProgress />
  }

  if (error) {
    return <div>Something went wrong...</div>
  }

  return (
    <Wrapper>
      <Drawer anchor='right' open={cartOpen} onClose={cartClose}>
        <Cart
          cartItems={cartItems}
          addToCart={handleAddToCart}
          removeFromCart={handleRemoveFromCart}
          onCartClose={cartClose}
        />
      </Drawer>
      {/* <StyledButton onClick={() => setCartOpen(true)} /> */}
      <StyledButton onClick={cartOpenClick}>
        <Badge badgeContent={getTotalItems(cartItems)} color='error'> <AddShoppingCart />
        </Badge>
      </StyledButton>
      <Grid container spacing={3}>
        {data?.map(item => (
          <Grid item key={item.id} xs={12} sm=
            {4}>
            <Items item={item} handleAddToCart={handleAddToCart} />
          </Grid>
        ))}
      </Grid>
    </Wrapper>
  );
}

export default App;
