import * as vscode from 'vscode';
import * as child_process from 'child_process';


let sclang : child_process.ChildProcessWithoutNullStreams | undefined;

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('scvscode.start', () => {
		start();
	});

	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('scvscode.evalSelectionOrLne', () => {
		evalSelectionOrLine();
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}


function start() {

	const sclangOutputChannel = vscode.window.createOutputChannel('scvscode');

	sclangOutputChannel.show(true);

	// Not sure that scvscode is proper IDE as sclang -i
	// TODO: reconsider IDE name
	sclang = child_process.spawn('sclang', ['-i', 'scvscode']);

	sclang.stdout.on('data', data => {
		sclangOutputChannel.appendLine(data.toString());
	});	
}

function evalSelectionOrLine() {

	const editor = vscode.window.activeTextEditor;
	let textToEval;

	if (editor)
	{
		if (editor.selection.isEmpty) {
			textToEval =
				editor.document.lineAt(editor.selection.active.line).text;
		} else {
			textToEval = editor.document.getText(editor.selection);
		}
	}

	textToEval += String.fromCharCode(0x1b, 0x0d);

	if (sclang === undefined) {
		start();
	}

	if (sclang !== undefined) {
		sclang.stdin.write(textToEval);
	}
}
