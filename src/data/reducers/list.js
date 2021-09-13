import actions from 'data/actions';

const initialState = {
  submissions: {},
  selected: [],
};

// eslint-disable-next-line no-unused-vars
const app = (state = initialState, { type, payload }) => {
  switch (type) {
    case actions.list.load.toString():
      return { ...state, submissions: payload };
    case actions.list.updateSelection.toString():
      return { ...state, selected: payload };
    default:
      return state;
  }
};

export { initialState };
export default app;
