declare module 'html5-qrcode' {
  export class Html5QrcodeScanner {
    constructor(
      elementId: string,
      config: {
        fps: number;
        qrbox: number;
      },
      verbose: boolean
    );
    render(
      onSuccess: (decodedText: string, decodedResult: any) => void,
      onError: (errorMessage: string) => void
    ): void;
    clear(): Promise<void>;
  }
}