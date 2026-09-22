import api from './api';

export const chatbotService = {
  sendMessage: async (message: string): Promise<{ reply: string, sources?: string[] }> => {
    // Stub implementation
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ reply: 'This is a mocked response from SIGNX Assistant.', sources: ['https://islrtc.nic.in'] });
      }, 1000);
    });
    // const response = await api.post('/chat', { message });
    // return response.data;
  }
};
