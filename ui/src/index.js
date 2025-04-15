import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider} from "react-router";
import { getSaveData } from './components/API';
import Game from './components/game/Game';

const router = createBrowserRouter([
  {
    children: [
      {
        index: true,
        Component: App
      },
      {
        children: [
          {
            path: ":gameId",
            loader: async ({ params }) => {
              let saveData = await getSaveData(Number.parseInt(params.gameId));
              return saveData;
            },
            Component: Game
          }
        ]
      }
    ]
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
