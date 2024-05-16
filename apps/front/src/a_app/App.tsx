import * as React from 'react';
import { Grommet } from 'grommet';
import Router from "./router/Router";
import useAuth from "../f_entities/hooks/useAuth";
import useGetInitialData from "../f_entities/hooks/useGetInitialData";
import {theme} from "../g_shared/constants/theme";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useEffect} from "react";
import {EB_EVENTS_NAMES} from "../g_shared/constants/eventBusEventsNames";

// todo реализовать редактирование профиля?
//  А что там редактировать-то на данный момент? Разве что email и пароль, но это не горит совершенно

// todo надо обдумать выставки и предусмотреть под них логику

// todo надо обдумать страницы собак/пометов/питомника и предусмотреть под них логику
//  вообще идея такая: просто шарить страницу, которая будет жить дней 10 и не иметь своего урла - это входит в расширенную подписку
//  постоянно держать страницу на поддомене и следить за её сео-показателями - за отдельную плату. сколько страниц - столько и платишь

// todo реализовать добавление документа и прикрепление к нему pdf-ки или картинки.
//  Возможно, там может быть конфиг документа, если его нужно будет заполнять в приложении?

// todo добавить собаке дату гибели

const App = () => {
  useGetInitialData();
  useAuth();

  useEffect(() => {
    window.addEventListener(EB_EVENTS_NAMES.ERROR, () => toast.error('ERROR'))

    return () => {
      window.removeEventListener(EB_EVENTS_NAMES.ERROR, () => toast.error('ERROR'))
    }
  }, [])

  return (
    <Grommet theme={theme} full>
      <Router/>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
      ></ToastContainer>
    </Grommet>
  )
}

export default App;
