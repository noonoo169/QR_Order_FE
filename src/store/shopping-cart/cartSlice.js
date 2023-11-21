import { createSlice } from "@reduxjs/toolkit";

const cartProduct =
  localStorage.getItem("cartProduct") !== null
    ? JSON.parse(localStorage.getItem("cartProduct"))
    : [];

const cartCombo =
  localStorage.getItem("cartCombo") !== null
  ? JSON.parse(localStorage.getItem("cartCombo"))
  : [];

const totalAmount =
  localStorage.getItem("totalAmount") !== null
    ? JSON.parse(localStorage.getItem("totalAmount"))
    : 0;

const totalQuantity =
  localStorage.getItem("totalQuantity") !== null
    ? JSON.parse(localStorage.getItem("totalQuantity"))
    : 0;

const setItemFunc = ( cartProduct, cartCombo, totalAmount, totalQuantity) => {
  localStorage.setItem("cartProduct", JSON.stringify(cartProduct));
  localStorage.setItem("cartCombo", JSON.stringify(cartCombo));
  localStorage.setItem("totalAmount", JSON.stringify(totalAmount));
  localStorage.setItem("totalQuantity", JSON.stringify(totalQuantity));
};

const initialState = {
  cartProduct: cartProduct,
  cartCombo: cartCombo,
  totalQuantity: totalQuantity,
  totalAmount: totalAmount,
};

const checkIsCombo = (state, isCombo) => {
  if (isCombo) {
    return state.cartCombo
  }
  return state.cartProduct
}

const updateState = (state) => {
  state.totalAmount = state.cartCombo.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity),
    0
  ) + state.cartProduct.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity),
    0
  );

  setItemFunc(
    state.cartProduct.map((item) => item),
    state.cartCombo.map((item) => item),
    state.totalAmount,
    state.totalQuantity
  );
}

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    // =========== add item ============
    addItem(state, action) {
      const newItem = action.payload;
      const tempState = checkIsCombo(state, action.payload.isCombo)
      const existingItem = tempState.find(
        (item) => item.id === newItem.id
      );
      state.totalQuantity++;

      if (!existingItem) {
        // ===== note: if you use just redux you should not mute state array instead of clone the state array, but if you use redux toolkit that will not a problem because redux toolkit clone the array behind the scene
        tempState.push({
          id: newItem.id,
          name: newItem.name,
          images: newItem.images,
          price: newItem.price,
          quantity: 1,
          totalPrice: newItem.price,
        });
      } else {
        existingItem.quantity++;
        existingItem.totalPrice =
          Number(existingItem.totalPrice) + Number(newItem.price);
      }
      updateState(state)
    },

    // ========= remove item ========
    removeItem(state, action) {
      
      const id = action.payload.id;
      var tempState = checkIsCombo(state, action.payload.isCombo)
      const existingItem = tempState.find((item) => item.id === id);
      state.totalQuantity--;

      if (existingItem.quantity === 1) {
        if(action.payload.isCombo) {
          state.cartCombo = state.cartCombo.filter((item) => item.id !== id);
        }
        else {
          state.cartProduct = state.cartProduct.filter((item) => item.id !== id);
        }
      } else {
        existingItem.quantity--;
        existingItem.totalPrice =
          Number(existingItem.totalPrice) - Number(existingItem.price);
      }
      updateState(state)
    },

    //============ delete item ===========

    deleteItem(state, action) {
      const id = action.payload.id;
      var tempState = checkIsCombo(state, action.payload.isCombo)
      const existingItem = tempState.find((item) => item.id === id);

      if (existingItem) {
        if(action.payload.isCombo) {
          state.cartCombo = state.cartCombo.filter((item) => item.id !== id);
        }
        else {
          state.cartProduct = state.cartProduct.filter((item) => item.id !== id);
        }
        state.totalQuantity = state.totalQuantity - existingItem.quantity;
      }
      updateState(state)
    },
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice;
