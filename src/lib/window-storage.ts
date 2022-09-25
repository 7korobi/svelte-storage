import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import { listen } from 'svelte/internal';
import { __BROWSER__ } from 'svelte-petit-utils';
import { devalue } from 'devalue';

type Cache = { [key: string]: [Writable<any>, Convert<any>] };
type Convert<T> = {
	parse(str: string): T;
	stringify(val: T): string;
};

function initConverter<T>(init: T): Convert<T> {
	return {
		parse(str) {
			return eval(`(${str})`);
		},
		stringify(val) {
			return devalue(val);
		}
	};
}

if (__BROWSER__) {
	listen(window, 'storage', (({ storageArea, key, newValue, oldValue, url }: StorageEvent) => {
		let cache: Cache = undefined as any as Cache;
		if (window.localStorage === storageArea) cache = local_cache;
		if (window.sessionStorage === storageArea) cache = session_cache;

		if (!cache[key!]) return;

		const [store, convert] = cache[key!];
		store.set(convert.parse(newValue!));
	}) as any);
}

const local_cache: Cache = {};
const session_cache: Cache = {};
function writeCache<T>(
	convert: Convert<T>,
	cache: Cache,
	storage: Storage,
	key: string,
	initValue: T
) {
	if (cache[key]) throw new Error(`${key} duplicated.`);

	initValue = convert.parse(storage.getItem(key)!) || initValue;

	const store = writable(initValue);
	store.subscribe((newValue) => {
		storage.setItem(key, convert.stringify(newValue));
	});
	cache[key] = [store, convert];
	return store;
}

export function writeLocal<T>(key: string, initValue: T, convert = initConverter(initValue)) {
	if (!__BROWSER__) return writable(initValue);
	return writeCache(convert, local_cache, window.localStorage, key, initValue);
}
export function writeSession<T>(key: string, initValue: T, convert = initConverter(initValue)) {
	if (!__BROWSER__) return writable(initValue);
	return writeCache(convert, session_cache, window.sessionStorage, key, initValue);
}
