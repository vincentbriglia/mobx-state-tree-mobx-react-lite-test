import classnames from 'classnames';
import { isObservable, isObservableArray, isObservableMap } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
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

export const useTimeout = (ms: number = 0) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let timer = setTimeout(() => {
      setReady(true);
    }, ms);

    return () => {
      clearTimeout(timer);
    };
  }, [ms]);

  return ready;
};

export const Users: FunctionComponent = observer(() => {
  const store = useContext(StoreContext);

  let ready = useTimeout(1000);

  console.log('isObservable', isObservable(store), isObservable(store.users));
  console.log('isObservableMap', isObservableMap(store), isObservableMap(store.users));
  console.log('isObservableArray', isObservableArray(store), isObservableArray(store.users));

  const classname = classnames('ui segment', {
    red: ready === false,
  });

  return (
    <div className={classname}>
      <pre>{JSON.stringify(store.users, null, 4)}</pre>
    </div>
  );
});

export const Reports: FunctionComponent = observer(() => {
  const store = useContext(StoreContext);

  let ready = useTimeout(1000);

  const classname = classnames('ui segment', {
    red: ready === false,
  });

  return (
    <div className={classname}>
      <pre>{JSON.stringify(store.reports, null, 4)}</pre>
    </div>
  );
});
