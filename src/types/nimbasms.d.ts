declare module 'nimbasms' {
  export interface NimbaSMSConfig {
    SERVICE_ID: string;
    SECRET_TOKEN: string;
  }

  export interface SMSMessage {
    to: string[];
    message: string;
    sender_name: string;
  }

  export interface SMSResponse {
    messageid: string;
    status: string;
  }

  export class Client {
    constructor(config: NimbaSMSConfig);
    messages: {
      create(message: SMSMessage): Promise<SMSResponse>;
    };
  }
} 