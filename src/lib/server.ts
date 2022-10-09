import type Redis from 'ioredis';
import { uneval } from 'devalue';

type Control = ReadableStreamController<any>;
type Streams = Map<Control, Control>;
type History = Set<string>;
type StreamArgs<T> = {
	load(path: string): Promise<T[]>;
};

type OptionArgs = {
	pub?: Redis;
	sub?: Redis;
};

const data = new Map<string, readonly [Streams, History]>();

function init(path: string, sug: Redis | undefined = undefined): readonly [Streams, History] {
	if (data.has(path)) return data.get(path)!;

	const item = [new Map<Control, Control>(), new Set<string>()] as const;
	data.set(path, item);
	return item;
}

function stream<T>(path: string, { load }: StreamArgs<T>, option: OptionArgs = {}) {
	const [streams, history] = init(path, option.sub);

	return { publish, response };

	async function wake() {
		if (option.sub) {
			option.sub.subscribe(path);
			option.sub.on('message', message);
		}

		console.log(`wakeup ${path}`);
		for (const value of await load(path)) {
			history.add(uneval(value));
		}
	}

	function shut() {
		history.clear();

		if (option.sub) {
			option.sub.off('message', message);
			option.sub.unsubscribe(path);
		}
	}

	function message(channel: string, text: string) {
		if (channel !== path) return;

		history.add(text);
		streams.forEach((key) => {
			key.enqueue(text + ';');
		});
		console.log(`message ${path} ${streams.size}`);
	}

	function publish(value: T) {
		const text = uneval(value);
		if (streams.size) {
			if (option.pub) {
				option.pub.publish(path, text);
			} else {
				message(path, text);
			}
		} else {
			shut();
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

				if (!size) await wake();
				history.forEach((text) => {
					key.enqueue(text + ';');
				});
			},

			cancel() {
				streams.delete(key);
				key.close();
				if (!streams.size) shut();
			}
		});
		return new Response(rs);
	}
}

export default stream;
