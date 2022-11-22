import * as vscode from 'vscode';
import * as child_process from 'child_process';


export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('scvscode.start', () => {
		start();
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}


function start() {

	const sclangOutputChannel = vscode.window.createOutputChannel('scvscode');

	sclangOutputChannel.show(true);

	// Not sure that scvscode is proper IDE as sclang -i
	// TODO: reconsider IDE name
	const sclang = child_process.spawn('sclang', ['-i', 'scvscode']);

	sclang.stdout.on('data', data => {
		sclangOutputChannel.appendLine(data.toString());
	});	
}
