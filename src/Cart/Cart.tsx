import { useState } from 'react';
import Button from '@material-ui/core/Button'

import CartItem from '../CartItem/CartItem'
// Styles
import { Wrapper } from './Cart.styles'
// Types
import { CartItemType } from '../App'

type Props = {
    cartItems: CartItemType[];
    addToCart: (clickedItem: CartItemType) => void;
    removeFromCart: (id: number) => void;
    onCartClose: () => void;
};


const Cart: React.FC<Props> = ({ cartItems, addToCart, removeFromCart, onCartClose }) => {

    const calculateTotal = (items: CartItemType[]) =>
        items.reduce((ack: number, item) => ack + item.amount * item.price, 0);



    return (
        <Wrapper>
            <Button size="small" variant="text" onClick={onCartClose}> x Close </Button>
            <h2>Your Shopping Cart</h2>
            {/* {cartItems.length === 0 ? (<p>No Items Found!</p>) : null}
            {cartItems.map(() => (
                <CartItem />
            ))} */}
            {cartItems.length === 0 ? (<p>No Items Found!</p>) : (
                <>
                    {cartItems.map((item) => (
                        <CartItem
                            key={item.id}
                            item={item}
                            addToCart={addToCart}
                            removeFromCart={removeFromCart}
                        />
                    ))}
                    <h2>Total: ${calculateTotal(cartItems).toFixed(2)}</h2>
                </>
            )}
        </Wrapper>
    )
}

export default Cart;