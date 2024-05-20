import { Disposable, Webview, WebviewPanel, window, Uri, ViewColumn, WebviewViewProvider, WebviewView, TextDocument } from "vscode";
import { getUri, getNonce } from "./utils";

/**
 * This class manages the state and behavior of HelloWorld webview panels.
 *
 * It contains all the data and methods for:
 *
 * - Creating and rendering HelloWorld webview panels
 * - Properly cleaning up and disposing of webview resources when the panel is closed
 * - Setting the HTML (and by proxy CSS/JavaScript) content of the webview panel
 * - Setting message listeners so data can be passed between the webview and extension
 */
export class ChatViewProvider implements WebviewViewProvider {
  _view?: WebviewView;
   _doc?: TextDocument;

  // public static currentPanel: ChatViewPanel | undefined;
  // private readonly _panel: WebviewPanel;
  // private _disposables: Disposable[] = [];

  /**
   * The ChatViewPanel class private constructor (called only from the render method).
   *
   * @param panel A reference to the webview panel
   * @param extensionUri The URI of the directory containing the extension
   */
  // private constructor(panel: WebviewPanel, extensionUri: Uri) {
  //   this._panel = panel;

  //   // Set an event listener to listen for when the panel is disposed (i.e. when the user closes
  //   // the panel or when the panel is closed programmatically)
  //   this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

  //   // Set the HTML content for the webview panel
  //   this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri);

  //   // Set an event listener to listen for messages passed from the webview context
  //   this._setWebviewMessageListener(this._panel.webview);
  // }

  constructor(private readonly _extensionUri: Uri) { }

  /**
   * Renders the current webview panel if it exists otherwise a new webview panel
   * will be created and displayed.
   *
   * @param extensionUri The URI of the directory containing the extension.
   */
  // public static render(extensionUri: Uri) {
  //   if (ChatViewPanel.currentPanel) {
  //     // If the webview panel already exists reveal it
  //     ChatViewPanel.currentPanel._panel.reveal(ViewColumn.One);
  //   } else {
  //     // If a webview panel does not already exist create and show a new one
  //     const panel = window.createWebviewPanel(
  //       // Panel view type
  //       "showHelloWorld",
  //       // Panel title
  //       "Hello World",
  //       // The editor column the panel should be displayed in
  //       ViewColumn.One,
  //       // Extra panel configurations
  //       {
  //         // Enable JavaScript in the webview
  //         enableScripts: true,
  //         // Restrict the webview to only load resources from the `out` and `webview-ui/build` directories
  //         localResourceRoots: [Uri.joinPath(extensionUri, "out"), Uri.joinPath(extensionUri, "webview/build")],
  //       }
  //     );

  //     ChatViewPanel.currentPanel = new ChatViewPanel(panel, extensionUri);
  //   }
  // }

  public resolveWebviewView(webviewView: WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };
    webviewView.webview.html = this._getWebviewContent(webviewView.webview, this._extensionUri);
    webviewView.webview.onDidReceiveMessage((data) => {
      console.log('onDidReceiveMessage data', data)
      switch (data.command) {
        case 'explainThis': {
          const { text, language } = data;
          console.log('text', text)
          console.log('language', language)
          return;
        }
      }
    });
    console.log('resolveWebviewView this._view', this._view)

}

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  // public dispose() {
  //   ChatViewPanel.currentPanel = undefined;

  //   // Dispose of the current webview panel
  //   this._panel.dispose();

  //   // Dispose of all disposables (i.e. commands) for the current webview panel
  //   while (this._disposables.length) {
  //     const disposable = this._disposables.pop();
  //     if (disposable) {
  //       disposable.dispose();
  //     }
  //   }
  // }

  /**
   * Defines and returns the HTML that should be rendered within the webview panel.
   *
   * @remarks This is also the place where references to the React webview build files
   * are created and inserted into the webview HTML.
   *
   * @param webview A reference to the extension webview
   * @param extensionUri The URI of the directory containing the extension
   * @returns A template string literal containing the HTML that should be
   * rendered within the webview panel
   */
  private _getWebviewContent(webview: Webview, extensionUri: Uri) {

    const nonce = getNonce();

    // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
    return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Hello World</title>
        </head>
        <body>
          <div id="root">hhhhå</div>
        </body>
      </html>
    `;
  }

  /**
   * Sets up an event listener to listen for messages passed from the webview context and
   * executes code based on the message that is recieved.
   *
   * @param webview A reference to the extension webview
   * @param context A reference to the extension context
   */
  // private _setWebviewMessageListener(webview: Webview) {
  //   webview.onDidReceiveMessage(
  //     (message: any) => {
  //       const command = message.command;
  //       const text = message.text;

  //       switch (command) {
  //         case "hello":
  //           // Code that should run in response to the hello message command
  //           window.showInformationMessage(text);
  //           return;
  //         // Add more switch case statements here as more webview message commands
  //         // are created within the webview context (i.e. inside media/main.js)
  //       }
  //     },
  //     undefined,
  //     this._disposables
  //   );
  // }

  public revive(panel: WebviewView) {
    this._view = panel;
  }

  public postMessage (message: any) {
    if (this._view) {
      console.log('this._view exist')
      console.log('this._view?.webview.', this._view?.webview)
      this._view?.webview.postMessage(message)
    }
  }
}