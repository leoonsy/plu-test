import '@/assets/style.css';
import { createApp, h } from 'vue';
import wrapper from 'vue3-webcomponent-wrapper';
import App from '@/App.vue';

const WeatherElement = wrapper(App, createApp, h);
window.customElements.define('weather-widget', WeatherElement);
