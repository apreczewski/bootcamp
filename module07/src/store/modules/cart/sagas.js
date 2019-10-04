import { call, select, put, all, takeLatest } from 'redux-saga/effects';

import api from '../../../services/api';
import history from '../../../services/history';
import { formatPrice } from '../../../util/format';
import { toast } from 'react-toastify';

import { addToCartSuccess, updateAmountSuccess } from './actions';

function* addToCart({ id }) {
  const checkProduct = yield select(state =>
    state.cart.find(item => item.id === id)
  );

  const stock = yield call(api.get, `/stock/${id}`);

  const stockAmount = stock.data.amount;
  const currentAmont = checkProduct ? checkProduct.amount : 0;

  const amount = currentAmont + 1;

  if (amount > stockAmount) {
    toast.error('Finish this product in stock');
    return;
  }

  if (checkProduct) {
    yield put(updateAmountSuccess(id, amount));
  } else {
    const response = yield call(api.get, `/products/${id}`);

    const data = {
      ...response.data,
      amount: 1,
      priceFormatted: formatPrice(response.data.price),
    };

    yield put(addToCartSuccess(data));

    history.push('/cart');
  }
}

function* updateAmount({ id, amount }) {
  if (amount <= 0) {
    return;
  }

  const stock = yield call(api.get, `/stock/${id}`);

  const stockAmount = stock.data.amount;

  if (amount > stockAmount) {
    toast.error('Finish this product in stock');
    return;
  }

  yield put(updateAmountSuccess(id, amount));
}

export default all([
  takeLatest('@cart/ADD_REQUEST', addToCart),
  takeLatest('@cart/UPDATE_AMOUNT_REQUEST', updateAmount),
]);
