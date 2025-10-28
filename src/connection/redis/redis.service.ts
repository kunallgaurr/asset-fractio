import { Inject, Injectable } from "@nestjs/common";
import type { RedisClientType } from "redis";
import { constants } from "src/utils";

@Injectable()
export class RedisService {
    constructor(
        @Inject(constants.PROVIDERS.REDIS_CONNECTION)
        private client: RedisClientType
    ) { }

    // SET Operations
    /**
     * Add a member to a Redis set
     * @param key - The set key
     * @param members - The member(s) to add to the set
     * @param expiry - Optional expiry time in seconds for the key
     * @returns Promise<[boolean, boolean | null]> - [sAdd result, expire result]
     */
    async sAdd(key: string, members: string, expiry?: number) {
        return await Promise.all([
            this.client.sAdd(key, members),
            expiry ? this.client.expire(key, expiry) : null
        ]);
    }

    /**
     * Get all members of a Redis set
     * @param key - The set key
     * @returns Promise<string[]> - Array of all members in the set
     */
    async sMembers(key: string) {
        return await this.client.sMembers(key)
    }

    /**
     * Check if a member exists in a Redis set
     * @param key - The set key
     * @param member - The member to check for
     * @returns Promise<boolean> - True if member exists, false otherwise
     */
    async sIsMember(key: string, member: string) {
        return await this.client.sIsMember(key, member)
    }

    /**
     * Remove a member from a Redis set
     * @param key - The set key
     * @param member - The member to remove
     * @returns Promise<boolean> - True if member exists, false otherwise
     */
    async sRem(key: string, member: string) {
        return await this.client.sRem(key, member);
    }

    // Hash Operations
    /**
     * Set a field-value pair in a Redis hash
     * @param key - The hash key
     * @param field - The field name
     * @param value - The field value
     * @param expiry - Optional expiry time in seconds for the key
     * @returns Promise<[number, boolean | null]> - [hSet result, expire result]
     */
    async hSet(key: string, field: string, value: string, expiry?: number) {
        return await Promise.all([
            this.client.hSet(key, field, value),
            expiry ? this.client.expire(key, expiry) : null
        ]);
    }

    /**
     * Set multiple field-value pairs in a Redis hash
     * @param key - The hash key
     * @param obj - Object containing field-value pairs
     * @param expiry - Optional expiry time in seconds for the key
     * @returns Promise<[number, boolean | null]> - [hSet result, expire result]
     */
    async hSetAll(key: string, obj: Record<string, any>, expiry?: number) {
        const dataToSave = {};

        for (const key in obj) {
            const value = obj[key];
            let val = value;

            if(typeof value === 'string') dataToSave[key] = value;
            if(typeof value === 'number') dataToSave[key] = value.toString();
            if(typeof value === 'boolean') dataToSave[key] = value.toString();
            if(typeof value === 'object') dataToSave[key] = JSON.parse(value);
            if(Array.isArray(val)) JSON.parse(value);
        }

        return await Promise.all([
            this.client.hSet(key, dataToSave),
            expiry ? this.client.expire(key, expiry) : null
        ]); 
    }

    /**
     * Get a field value from a Redis hash
     * @param key - The hash key
     * @param field - The field name
     * @returns Promise<string | undefined> - The field value or undefined if not found
     */
    async hGet(key: string, field: string) {
        return await this.client.hGet(key, field);
    }

    /**
     * Get all field-value pairs from a Redis hash
     * @param key - The hash key
     * @returns Promise<Record<string, string>> - Object containing all field-value pairs
     */
    async hGetAll(key: string) {
        return await this.client.hGetAll(key);
    }

    // String Operations
    /**
     * Set a string value in Redis with optional expiry
     * @param key - The key to set
     * @param value - The string value to store
     * @param expiry - Expiry time in seconds for the key
     * @returns Promise<[string | null, boolean | null]> - [set result, expire result]
     */
    async set(key: string, value: string, expiry: number) {
        return await Promise.all([
            this.client.set(key, value),
            expiry ? this.client.expire(key, expiry) : null
        ])
    }

    /**
     * Get a string value from Redis
     * @param key - The key to retrieve
     * @returns Promise<string | null> - The string value or null if key doesn't exist
     */
    async get(key: string) {
        return await this.client.get(key);
    }

    /**
     * Increment a numeric value from Redis
     * @param key - The key to retrieve
     * @returns Promise<number> - The string value or null if key doesn't exist
     */
    async incr(key: string) {
        return await this.client.incr(key);
    }

    async expire(key: string, expiry: number) {
        return await this.client.expire(key, expiry);
    }

    // JSON Operations
    /**
     * Get JSON data from Redis with optional path
     * @param key - The JSON key to retrieve
     * @param path - Optional JSONPath to specific part of the JSON (defaults to root '$')
     * @returns Promise<any> - The JSON data or specific path value
     */
    async jGet(key: string, path?: string) {
        if (path) {
            return await this.client.json.GET(key, { path });
        }

        return await this.client.json.GET(key);
    }

    /**
     * Set JSON data at a specific path in Redis
     * @param key - The JSON key to set
     * @param path - JSONPath where to set the value
     * @param value - The value to set (will be JSON.stringify'd)
     * @param expiry - Optional expiry time in seconds for the key
     * @returns Promise<[string, boolean | null]> - [set result, expire result]
     */
    async jSet(key: string, path: string, value: any, expiry?: number) {
        return await Promise.all([
            this.client.json.SET(key, path, JSON.stringify(value)),
            expiry ? this.client.expire(key, expiry) : null
        ]);
    }

    /**
     * Set entire JSON object in Redis (replaces all data)
     * @param key - The JSON key to set
     * @param obj - The complete JSON object to store
     * @param expiry - Optional expiry time in seconds for the key
     * @returns Promise<[string, boolean | null]> - [set result, expire result]
     */
    async jSetAll(key: string, obj: Record<string, any>, expiry?: number) {
        return await Promise.all([
            this.client.json.SET(key, '$', obj),
            expiry ? this.client.expire(key, expiry) : null
        ]);
    }

    /**
     * Delete JSON data at a specific path or entire key
     * @param key - The JSON key
     * @param path - Optional JSONPath to delete (defaults to entire key)
     * @returns Promise<number> - Number of paths deleted
     */
    async jDel(key: string, path?: string) {
        if (path) {
            return await this.client.json.DEL(key, { path });
        }
        return await this.client.json.DEL(key);
    }

    /**
     * Append values to a JSON array
     * @param key - The JSON key
     * @param path - JSONPath to the array
     * @param values - Values to append to the array (will be JSON.stringify'd)
     * @returns Promise<number[]> - Array of new lengths for each path
     */
    async jArrAppend(key: string, path: string, ...values: any[]) {
        return await this.client.json.ARRAPPEND(key, path, values.map(v => JSON.stringify(v)));
    }

    /**
     * Get the length of a JSON array
     * @param key - The JSON key
     * @param path - Optional JSONPath to the array (defaults to root)
     * @returns Promise<number[]> - Array lengths for each path
     */
    async jArrLen(key: string, path?: string) {
        if (path !== undefined) {
            return await this.client.json.ARRLEN(key, { path });
        }
        return await this.client.json.ARRLEN(key);
    }

    /**
     * Remove and return element(s) from a JSON array
     * @param key - The JSON key
     * @param path - Optional JSONPath to the array (defaults to root)
     * @param index - Optional index to pop from (defaults to last element)
     * @returns Promise<any[]> - Array of popped values
     */
    async jArrPop(key: string, path?: string, index?: number) {
        if (path !== undefined && index !== undefined) {
            return await this.client.json.ARRPOP(key, { path, index });
        } else if (path !== undefined) {
            return await this.client.json.ARRPOP(key, { path });
        } else {
            return await this.client.json.ARRPOP(key);
        }
    }

    /**
     * Insert values into a JSON array at a specific index
     * @param key - The JSON key
     * @param path - JSONPath to the array
     * @param index - Index where to insert the values
     * @param values - Values to insert (will be JSON.stringify'd)
     * @returns Promise<number[]> - Array of new lengths for each path
     */
    async jArrInsert(key: string, path: string, index: number, ...values: any[]) {
        // Redis expects a variadic list of value arguments, not an array.
        // However, passing a spread on a non-tuple array causes a TS error in strict mode.
        // To avoid TS2742, use .apply with the mapped JSON values.
        return await (this.client.json.ARRINSERT as any).apply(
            this.client.json,
            [key, path, index, ...values.map(v => JSON.stringify(v))]
        );
    }

    /**
     * Get all keys from a JSON object
     * @param key - The JSON key
     * @param path - Optional JSONPath to the object (defaults to root)
     * @returns Promise<string[][]> - Array of key arrays for each path
     */
    async jObjKeys(key: string, path?: string) {
        if (path !== undefined) {
            return await this.client.json.OBJKEYS(key, { path });
        }
        return await this.client.json.OBJKEYS(key);
    }

    /**
     * Get the number of keys in a JSON object
     * @param key - The JSON key
     * @param path - Optional JSONPath to the object (defaults to root)
     * @returns Promise<number[]> - Array of key counts for each path
     */
    async jObjLen(key: string, path?: string) {
        if (path !== undefined) {
            return await this.client.json.OBJLEN(key, { path });
        }
        return await this.client.json.OBJLEN(key);
    }

    /**
     * Get the length of a JSON string
     * @param key - The JSON key
     * @param path - Optional JSONPath to the string (defaults to root)
     * @returns Promise<number[]> - Array of string lengths for each path
     */
    async jStrLen(key: string, path?: string) {
        if (path !== undefined) {
            return await this.client.json.STRLEN(key, { path });
        }
        return await this.client.json.STRLEN(key);
    }

    /**
     * Increment a JSON number by a value
     * @param key - The JSON key
     * @param path - JSONPath to the number
     * @param value - Value to increment by
     * @returns Promise<string[]> - Array of new values for each path
     */
    async jNumIncrBy(key: string, path: string, value: number) {
        return await this.client.json.NUMINCRBY(key, path, value);
    }

    /**
     * Multiply a JSON number by a value
     * @param key - The JSON key
     * @param path - JSONPath to the number
     * @param value - Value to multiply by
     * @returns Promise<string[]> - Array of new values for each path
     */
    async jNumMultBy(key: string, path: string, value: number) {
        return await this.client.json.NUMMULTBY(key, path, value);
    }

    /**
     * Toggle a JSON boolean value
     * @param key - The JSON key
     * @param path - JSONPath to the boolean
     * @returns Promise<number[]> - Array of new boolean values for each path
     */
    async jToggle(key: string, path: string) {
        return await this.client.json.TOGGLE(key, path);
    }

    /**
     * Clear all values from JSON containers (arrays/objects)
     * @param key - The JSON key
     * @param path - Optional JSONPath to clear (defaults to root)
     * @returns Promise<number> - Number of paths cleared
     */
    async jClear(key: string, path?: string) {
        if (path !== undefined) {
            return await this.client.json.CLEAR(key, { path });
        }
        return await this.client.json.CLEAR(key);
    }

    /**
     * Get values from multiple JSON keys at the same path
     * @param keys - Array of JSON keys to get from
     * @param path - Optional JSONPath (defaults to '$')
     * @returns Promise<any[]> - Array of values from each key
     */
    async jMGet(keys: string[], path?: string) {
        return await this.client.json.MGET(keys, path ?? '$');
    }

    // JSON Array Utilities
    /**
     * Push a value to a JSON array with optional expiry
     * @param key - The JSON key
     * @param arrayPath - JSONPath to the array
     * @param value - Value to push to the array
     * @param expiry - Optional expiry time in seconds for the key
     * @returns Promise<number[]> - Array of new lengths for each path
     */
    async jPushToArray(key: string, arrayPath: string, value: any, expiry?: number) {
        const result = await this.jArrAppend(key, arrayPath, value);
        if (expiry) {
            await this.client.expire(key, expiry);
        }
        return result;
    }

    /**
     * Remove a specific value from a JSON array
     * @param key - The JSON key
     * @param arrayPath - JSONPath to the array
     * @param value - Value to remove from the array
     * @returns Promise<[string, boolean | null] | null> - Set result or null if array not found
     */
    async jRemoveFromArray(key: string, arrayPath: string, value: any) {
        // Get current array
        const currentArray = await this.jGet(key, arrayPath);
        if (Array.isArray(currentArray)) {
            const updatedArray = currentArray.filter(item => JSON.stringify(item) !== JSON.stringify(value));
            return await this.jSet(key, arrayPath, updatedArray);
        }
        return null;
    }

    // JSON Object Utilities
    /**
     * Update properties of a JSON object by merging with existing data
     * @param key - The JSON key
     * @param objectPath - JSONPath to the object
     * @param updates - Object containing properties to update
     * @param expiry - Optional expiry time in seconds for the key
     * @returns Promise<[string, boolean | null]> - [set result, expire result]
     */
    async jUpdateObject(key: string, objectPath: string, updates: Record<string, any>, expiry?: number) {
        const currentObj = await this.jGet(key, objectPath);
        // Ensure both currentObj and updates are objects before spreading
        const baseObj = (currentObj !== null && typeof currentObj === 'object') ? currentObj : {};
        const updateObj = (updates !== null && typeof updates === 'object') ? updates : {};
        const updatedObj = Object.assign({}, baseObj, updateObj);
        return await this.jSet(key, objectPath, updatedObj, expiry);
    }

    /**
     * Get nested JSON data using a specific path
     * @param key - The JSON key
     * @param path - JSONPath to the nested data
     * @returns Promise<any> - The nested data or undefined if not found
     */
    async jGetNested(key: string, path: string) {
        // The Redis client .json.GET expects the second argument to be of type JsonGetOptions or undefined.
        // If a string path is provided, convert to options object.
        if (typeof path === 'string') {
            return await this.client.json.GET(key, { path });
        }
        // fallback, though path should be string as per typing
        return await this.client.json.GET(key);
    }

    /**
     * Set nested JSON data at a specific path
     * @param key - The JSON key
     * @param path - JSONPath where to set the data
     * @param value - The value to set
     * @param expiry - Optional expiry time in seconds for the key
     * @returns Promise<[string, boolean | null]> - [set result, expire result]
     */
    async jSetNested(key: string, path: string, value: any, expiry?: number) {
        // Use the underlying jSet, which should accept path as string
        return await this.jSet(key, path, value, expiry);
    }
};