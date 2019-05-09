import { observer } from 'mobx-react-lite';
import React, { FunctionComponent, useContext } from 'react';
import './App.css';
import { StoreContext } from './store';

export const App: FunctionComponent = () => {
  return (
    <div className="ui main text container">
      <Users />
      <Reports />
    </div>
  );
};

export const Users: FunctionComponent = observer(() => {
  const store = useContext(StoreContext);
  return (
    <div className="ui segment">
      <pre>{JSON.stringify(store.users, null, 4)}</pre>
    </div>
  );
});

export const Reports: FunctionComponent = observer(() => {
  const store = useContext(StoreContext);
  return (
    <div className="ui segment">
      <pre>{JSON.stringify(store.reports, null, 4)}</pre>
    </div>
  );
});
