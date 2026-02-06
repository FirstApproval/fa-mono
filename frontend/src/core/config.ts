import { configService } from './service';

const CONFIG_KEY = 'appConfig';

export async function initConfig(): Promise<void> {
  try {
    const response = await configService.getConfig();
    const config = response.data;
    sessionStorage.setItem(CONFIG_KEY, JSON.stringify(config));

    const env = config.environment;
    document.title = env ? `First Approval (${env})` : 'First Approval';
  } catch (e) {
    console.error('Failed to load app config', e);
  }
}

export function getAppConfig() {
  const raw = sessionStorage.getItem(CONFIG_KEY);
  return raw ? JSON.parse(raw) : null;
}
