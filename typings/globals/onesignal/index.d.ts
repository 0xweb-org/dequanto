declare module 'OneSignal' {
    export = OneSignal;
}

declare var OneSignal: IOneSignalWeb;

interface IOneSignalWeb {
    initialized: boolean

    push(value: () => void): void;
    init(any): void;
    getUserId(val: (string) => void): void;
    getNotificationPermission (): Promise<'granted' | 'denied' | 'default'>

    showNativePrompt(): void;
    isPushNotificationsSupported(): boolean;
    isPushNotificationsEnabled(): Promise<boolean>;

    setExternalUserId (userId)
    getExternalUserId ()
    removeExternalUserId (userId)

    showSlidedownPrompt ()

    addListenerForNotificationOpened (cb)

    on(event: string, cb: (any) => void): void;
    setSubscription(value: boolean);
}

interface IPushNotification {
    id?: string
    heading?: string
    content?: string
    data?: any
    url?: string
    icon?: string
}
