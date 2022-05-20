export { default as MemoComponent } from "./MemoComponent";

import {
  Image as TaroImage,
  Button as TaroButton,
  Form as TaroForm,
  Input as TaroInput,
  View as TaroView,
  Text as TaroText,
  WebView as TaroWebView
} from "@tarojs/components";

export const Image = TaroImage as JSX.Element | any;
export const Button = TaroButton as JSX.Element | any;
export const Form = TaroForm as JSX.Element | any;
export const Input = TaroInput as JSX.Element | any;
export const View = TaroView as JSX.Element | any;
export const Text = TaroText as JSX.Element | any;
export const WebView = TaroWebView as JSX.Element | any;
