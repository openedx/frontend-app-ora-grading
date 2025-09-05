/* eslint-disable import/no-extraneous-dependencies */
import '@testing-library/jest-dom';

jest.mock('data/constants/app', () => ({
  locationId: () => 'fake-location-id',
}));

jest.mock('hooks', () => ({
  ...jest.requireActual('hooks'),
  nullMethod: jest.fn().mockName('hooks.nullMethod'),
}));

jest.mock('@zip.js/zip.js', () => ({}));

// Mock react-redux hooks
// unmock for integration tests
jest.mock('react-redux', () => {
  const dispatch = jest.fn((...args) => ({ dispatch: args })).mockName('react-redux.dispatch');
  return {
    connect: (mapStateToProps, mapDispatchToProps) => (component) => ({
      mapStateToProps,
      mapDispatchToProps,
      component,
    }),
    useDispatch: jest.fn(() => dispatch),
    useSelector: jest.fn((selector) => ({ useSelector: selector })),
  };
});
