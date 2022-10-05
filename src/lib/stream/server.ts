import { devalue } from 'devalue';

type Control = ReadableStreamController<any>;
type Streams = Map<Control, Control>;
type History = Set<string>;
type StreamArgs<T> = {
	load(): Promise<T[]>;
};

const data = new Map<string, readonly [Streams, History]>();

function init(path: string): readonly [Streams, History] {
	if (data.has(path)) return data.get(path)!;

	const item = [new Map<Control, Control>(), new Set<string>()] as const;
	data.set(path, item);
	return item;
}

function stream<T>(path: string, { load }: StreamArgs<T>) {
	const [streams, history] = init(path);

	return { publish, response };

	function publish(value: T) {
		const text = devalue(value);
		if (streams.size) {
			history.add(text);
			streams.forEach((key) => {
				key.enqueue(text + ';');
			});
			console.log(`publish ${path} ${streams.size}`);
		} else {
			history.clear();
		}

		return text;
	}

	function response() {
		let key: Control;

		const rs = new ReadableStream({
			async start(controller: Control) {
				const { size } = streams;
				key = controller;
				streams.set(key, controller);

				if (!size) {
					console.log(`wake ${path}`);
					for (const value of await load()) {
						history.add(devalue(value));
					}
				}
				history.forEach((text) => {
					key.enqueue(text + ';');
				});
			},

			cancel() {
				streams.delete(key);
				key.close();
				if (!streams.size) history.clear();
			}
		});
		return new Response(rs);
	}
}

export default stream;
