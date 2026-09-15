
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model InadimplenciaDiaria
 * 
 */
export type InadimplenciaDiaria = $Result.DefaultSelection<Prisma.$InadimplenciaDiariaPayload>
/**
 * Model DashboardAggregates
 * 
 */
export type DashboardAggregates = $Result.DefaultSelection<Prisma.$DashboardAggregatesPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more InadimplenciaDiarias
 * const inadimplenciaDiarias = await prisma.inadimplenciaDiaria.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more InadimplenciaDiarias
   * const inadimplenciaDiarias = await prisma.inadimplenciaDiaria.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<'extends', Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.inadimplenciaDiaria`: Exposes CRUD operations for the **InadimplenciaDiaria** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InadimplenciaDiarias
    * const inadimplenciaDiarias = await prisma.inadimplenciaDiaria.findMany()
    * ```
    */
  get inadimplenciaDiaria(): Prisma.InadimplenciaDiariaDelegate<ExtArgs>;

  /**
   * `prisma.dashboardAggregates`: Exposes CRUD operations for the **DashboardAggregates** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DashboardAggregates
    * const dashboardAggregates = await prisma.dashboardAggregates.findMany()
    * ```
    */
  get dashboardAggregates(): Prisma.DashboardAggregatesDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.14.0
   * Query Engine version: e9771e62de70f79a5e1c604a2d7c8e2a0a874b48
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | JsonObject | JsonArray | null

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {readonly [Key in string]?: InputJsonValue | null}

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
  export type InputJsonValue = string | number | boolean | InputJsonObject | InputJsonArray | { toJSON(): unknown }

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    InadimplenciaDiaria: 'InadimplenciaDiaria',
    DashboardAggregates: 'DashboardAggregates'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }


  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs}, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meta: {
      modelProps: 'inadimplenciaDiaria' | 'dashboardAggregates'
      txIsolationLevel: Prisma.TransactionIsolationLevel
    },
    model: {
      InadimplenciaDiaria: {
        payload: Prisma.$InadimplenciaDiariaPayload<ExtArgs>
        fields: Prisma.InadimplenciaDiariaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InadimplenciaDiariaFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$InadimplenciaDiariaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InadimplenciaDiariaFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$InadimplenciaDiariaPayload>
          }
          findFirst: {
            args: Prisma.InadimplenciaDiariaFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$InadimplenciaDiariaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InadimplenciaDiariaFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$InadimplenciaDiariaPayload>
          }
          findMany: {
            args: Prisma.InadimplenciaDiariaFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$InadimplenciaDiariaPayload>[]
          }
          create: {
            args: Prisma.InadimplenciaDiariaCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$InadimplenciaDiariaPayload>
          }
          createMany: {
            args: Prisma.InadimplenciaDiariaCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InadimplenciaDiariaCreateManyAndReturnArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$InadimplenciaDiariaPayload>[]
          }
          delete: {
            args: Prisma.InadimplenciaDiariaDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$InadimplenciaDiariaPayload>
          }
          update: {
            args: Prisma.InadimplenciaDiariaUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$InadimplenciaDiariaPayload>
          }
          deleteMany: {
            args: Prisma.InadimplenciaDiariaDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.InadimplenciaDiariaUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.InadimplenciaDiariaUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$InadimplenciaDiariaPayload>
          }
          aggregate: {
            args: Prisma.InadimplenciaDiariaAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateInadimplenciaDiaria>
          }
          groupBy: {
            args: Prisma.InadimplenciaDiariaGroupByArgs<ExtArgs>,
            result: $Utils.Optional<InadimplenciaDiariaGroupByOutputType>[]
          }
          count: {
            args: Prisma.InadimplenciaDiariaCountArgs<ExtArgs>,
            result: $Utils.Optional<InadimplenciaDiariaCountAggregateOutputType> | number
          }
        }
      }
      DashboardAggregates: {
        payload: Prisma.$DashboardAggregatesPayload<ExtArgs>
        fields: Prisma.DashboardAggregatesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DashboardAggregatesFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DashboardAggregatesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DashboardAggregatesFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DashboardAggregatesPayload>
          }
          findFirst: {
            args: Prisma.DashboardAggregatesFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DashboardAggregatesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DashboardAggregatesFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DashboardAggregatesPayload>
          }
          findMany: {
            args: Prisma.DashboardAggregatesFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DashboardAggregatesPayload>[]
          }
          create: {
            args: Prisma.DashboardAggregatesCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DashboardAggregatesPayload>
          }
          createMany: {
            args: Prisma.DashboardAggregatesCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DashboardAggregatesCreateManyAndReturnArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DashboardAggregatesPayload>[]
          }
          delete: {
            args: Prisma.DashboardAggregatesDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DashboardAggregatesPayload>
          }
          update: {
            args: Prisma.DashboardAggregatesUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DashboardAggregatesPayload>
          }
          deleteMany: {
            args: Prisma.DashboardAggregatesDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.DashboardAggregatesUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.DashboardAggregatesUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DashboardAggregatesPayload>
          }
          aggregate: {
            args: Prisma.DashboardAggregatesAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateDashboardAggregates>
          }
          groupBy: {
            args: Prisma.DashboardAggregatesGroupByArgs<ExtArgs>,
            result: $Utils.Optional<DashboardAggregatesGroupByOutputType>[]
          }
          count: {
            args: Prisma.DashboardAggregatesCountArgs<ExtArgs>,
            result: $Utils.Optional<DashboardAggregatesCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<'define', Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model InadimplenciaDiaria
   */

  export type AggregateInadimplenciaDiaria = {
    _count: InadimplenciaDiariaCountAggregateOutputType | null
    _avg: InadimplenciaDiariaAvgAggregateOutputType | null
    _sum: InadimplenciaDiariaSumAggregateOutputType | null
    _min: InadimplenciaDiariaMinAggregateOutputType | null
    _max: InadimplenciaDiariaMaxAggregateOutputType | null
  }

  export type InadimplenciaDiariaAvgAggregateOutputType = {
    id: number | null
    valorTotal: number | null
  }

  export type InadimplenciaDiariaSumAggregateOutputType = {
    id: number | null
    valorTotal: number | null
  }

  export type InadimplenciaDiariaMinAggregateOutputType = {
    id: number | null
    dataReferencia: Date | null
    valorTotal: number | null
    detalhes: string | null
    dataExecucao: Date | null
  }

  export type InadimplenciaDiariaMaxAggregateOutputType = {
    id: number | null
    dataReferencia: Date | null
    valorTotal: number | null
    detalhes: string | null
    dataExecucao: Date | null
  }

  export type InadimplenciaDiariaCountAggregateOutputType = {
    id: number
    dataReferencia: number
    valorTotal: number
    detalhes: number
    dataExecucao: number
    _all: number
  }


  export type InadimplenciaDiariaAvgAggregateInputType = {
    id?: true
    valorTotal?: true
  }

  export type InadimplenciaDiariaSumAggregateInputType = {
    id?: true
    valorTotal?: true
  }

  export type InadimplenciaDiariaMinAggregateInputType = {
    id?: true
    dataReferencia?: true
    valorTotal?: true
    detalhes?: true
    dataExecucao?: true
  }

  export type InadimplenciaDiariaMaxAggregateInputType = {
    id?: true
    dataReferencia?: true
    valorTotal?: true
    detalhes?: true
    dataExecucao?: true
  }

  export type InadimplenciaDiariaCountAggregateInputType = {
    id?: true
    dataReferencia?: true
    valorTotal?: true
    detalhes?: true
    dataExecucao?: true
    _all?: true
  }

  export type InadimplenciaDiariaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InadimplenciaDiaria to aggregate.
     */
    where?: InadimplenciaDiariaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InadimplenciaDiarias to fetch.
     */
    orderBy?: InadimplenciaDiariaOrderByWithRelationInput | InadimplenciaDiariaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InadimplenciaDiariaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InadimplenciaDiarias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InadimplenciaDiarias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InadimplenciaDiarias
    **/
    _count?: true | InadimplenciaDiariaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InadimplenciaDiariaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InadimplenciaDiariaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InadimplenciaDiariaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InadimplenciaDiariaMaxAggregateInputType
  }

  export type GetInadimplenciaDiariaAggregateType<T extends InadimplenciaDiariaAggregateArgs> = {
        [P in keyof T & keyof AggregateInadimplenciaDiaria]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInadimplenciaDiaria[P]>
      : GetScalarType<T[P], AggregateInadimplenciaDiaria[P]>
  }




  export type InadimplenciaDiariaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InadimplenciaDiariaWhereInput
    orderBy?: InadimplenciaDiariaOrderByWithAggregationInput | InadimplenciaDiariaOrderByWithAggregationInput[]
    by: InadimplenciaDiariaScalarFieldEnum[] | InadimplenciaDiariaScalarFieldEnum
    having?: InadimplenciaDiariaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InadimplenciaDiariaCountAggregateInputType | true
    _avg?: InadimplenciaDiariaAvgAggregateInputType
    _sum?: InadimplenciaDiariaSumAggregateInputType
    _min?: InadimplenciaDiariaMinAggregateInputType
    _max?: InadimplenciaDiariaMaxAggregateInputType
  }

  export type InadimplenciaDiariaGroupByOutputType = {
    id: number
    dataReferencia: Date
    valorTotal: number
    detalhes: string | null
    dataExecucao: Date
    _count: InadimplenciaDiariaCountAggregateOutputType | null
    _avg: InadimplenciaDiariaAvgAggregateOutputType | null
    _sum: InadimplenciaDiariaSumAggregateOutputType | null
    _min: InadimplenciaDiariaMinAggregateOutputType | null
    _max: InadimplenciaDiariaMaxAggregateOutputType | null
  }

  type GetInadimplenciaDiariaGroupByPayload<T extends InadimplenciaDiariaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InadimplenciaDiariaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InadimplenciaDiariaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InadimplenciaDiariaGroupByOutputType[P]>
            : GetScalarType<T[P], InadimplenciaDiariaGroupByOutputType[P]>
        }
      >
    >


  export type InadimplenciaDiariaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dataReferencia?: boolean
    valorTotal?: boolean
    detalhes?: boolean
    dataExecucao?: boolean
  }, ExtArgs["result"]["inadimplenciaDiaria"]>

  export type InadimplenciaDiariaSelectScalar = {
    id?: boolean
    dataReferencia?: boolean
    valorTotal?: boolean
    detalhes?: boolean
    dataExecucao?: boolean
  }



  export type $InadimplenciaDiariaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InadimplenciaDiaria"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      dataReferencia: Date
      valorTotal: number
      detalhes: string | null
      dataExecucao: Date
    }, ExtArgs["result"]["inadimplenciaDiaria"]>
    composites: {}
  }


  type InadimplenciaDiariaGetPayload<S extends boolean | null | undefined | InadimplenciaDiariaDefaultArgs> = $Result.GetResult<Prisma.$InadimplenciaDiariaPayload, S>

  type InadimplenciaDiariaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<InadimplenciaDiariaFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: InadimplenciaDiariaCountAggregateInputType | true
    }

  export interface InadimplenciaDiariaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InadimplenciaDiaria'], meta: { name: 'InadimplenciaDiaria' } }
    /**
     * Find zero or one InadimplenciaDiaria that matches the filter.
     * @param {InadimplenciaDiariaFindUniqueArgs} args - Arguments to find a InadimplenciaDiaria
     * @example
     * // Get one InadimplenciaDiaria
     * const inadimplenciaDiaria = await prisma.inadimplenciaDiaria.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends InadimplenciaDiariaFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, InadimplenciaDiariaFindUniqueArgs<ExtArgs>>
    ): Prisma__InadimplenciaDiariaClient<$Result.GetResult<Prisma.$InadimplenciaDiariaPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one InadimplenciaDiaria that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {InadimplenciaDiariaFindUniqueOrThrowArgs} args - Arguments to find a InadimplenciaDiaria
     * @example
     * // Get one InadimplenciaDiaria
     * const inadimplenciaDiaria = await prisma.inadimplenciaDiaria.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends InadimplenciaDiariaFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, InadimplenciaDiariaFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__InadimplenciaDiariaClient<$Result.GetResult<Prisma.$InadimplenciaDiariaPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first InadimplenciaDiaria that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InadimplenciaDiariaFindFirstArgs} args - Arguments to find a InadimplenciaDiaria
     * @example
     * // Get one InadimplenciaDiaria
     * const inadimplenciaDiaria = await prisma.inadimplenciaDiaria.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends InadimplenciaDiariaFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, InadimplenciaDiariaFindFirstArgs<ExtArgs>>
    ): Prisma__InadimplenciaDiariaClient<$Result.GetResult<Prisma.$InadimplenciaDiariaPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first InadimplenciaDiaria that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InadimplenciaDiariaFindFirstOrThrowArgs} args - Arguments to find a InadimplenciaDiaria
     * @example
     * // Get one InadimplenciaDiaria
     * const inadimplenciaDiaria = await prisma.inadimplenciaDiaria.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends InadimplenciaDiariaFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, InadimplenciaDiariaFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__InadimplenciaDiariaClient<$Result.GetResult<Prisma.$InadimplenciaDiariaPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more InadimplenciaDiarias that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InadimplenciaDiariaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InadimplenciaDiarias
     * const inadimplenciaDiarias = await prisma.inadimplenciaDiaria.findMany()
     * 
     * // Get first 10 InadimplenciaDiarias
     * const inadimplenciaDiarias = await prisma.inadimplenciaDiaria.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const inadimplenciaDiariaWithIdOnly = await prisma.inadimplenciaDiaria.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends InadimplenciaDiariaFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, InadimplenciaDiariaFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InadimplenciaDiariaPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a InadimplenciaDiaria.
     * @param {InadimplenciaDiariaCreateArgs} args - Arguments to create a InadimplenciaDiaria.
     * @example
     * // Create one InadimplenciaDiaria
     * const InadimplenciaDiaria = await prisma.inadimplenciaDiaria.create({
     *   data: {
     *     // ... data to create a InadimplenciaDiaria
     *   }
     * })
     * 
    **/
    create<T extends InadimplenciaDiariaCreateArgs<ExtArgs>>(
      args: SelectSubset<T, InadimplenciaDiariaCreateArgs<ExtArgs>>
    ): Prisma__InadimplenciaDiariaClient<$Result.GetResult<Prisma.$InadimplenciaDiariaPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many InadimplenciaDiarias.
     * @param {InadimplenciaDiariaCreateManyArgs} args - Arguments to create many InadimplenciaDiarias.
     * @example
     * // Create many InadimplenciaDiarias
     * const inadimplenciaDiaria = await prisma.inadimplenciaDiaria.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
    **/
    createMany<T extends InadimplenciaDiariaCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, InadimplenciaDiariaCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many InadimplenciaDiarias and returns the data saved in the database.
     * @param {InadimplenciaDiariaCreateManyAndReturnArgs} args - Arguments to create many InadimplenciaDiarias.
     * @example
     * // Create many InadimplenciaDiarias
     * const inadimplenciaDiaria = await prisma.inadimplenciaDiaria.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many InadimplenciaDiarias and only return the `id`
     * const inadimplenciaDiariaWithIdOnly = await prisma.inadimplenciaDiaria.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
    **/
    createManyAndReturn<T extends InadimplenciaDiariaCreateManyAndReturnArgs<ExtArgs>>(
      args?: SelectSubset<T, InadimplenciaDiariaCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InadimplenciaDiariaPayload<ExtArgs>, T, 'createManyAndReturn'>>

    /**
     * Delete a InadimplenciaDiaria.
     * @param {InadimplenciaDiariaDeleteArgs} args - Arguments to delete one InadimplenciaDiaria.
     * @example
     * // Delete one InadimplenciaDiaria
     * const InadimplenciaDiaria = await prisma.inadimplenciaDiaria.delete({
     *   where: {
     *     // ... filter to delete one InadimplenciaDiaria
     *   }
     * })
     * 
    **/
    delete<T extends InadimplenciaDiariaDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, InadimplenciaDiariaDeleteArgs<ExtArgs>>
    ): Prisma__InadimplenciaDiariaClient<$Result.GetResult<Prisma.$InadimplenciaDiariaPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one InadimplenciaDiaria.
     * @param {InadimplenciaDiariaUpdateArgs} args - Arguments to update one InadimplenciaDiaria.
     * @example
     * // Update one InadimplenciaDiaria
     * const inadimplenciaDiaria = await prisma.inadimplenciaDiaria.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends InadimplenciaDiariaUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, InadimplenciaDiariaUpdateArgs<ExtArgs>>
    ): Prisma__InadimplenciaDiariaClient<$Result.GetResult<Prisma.$InadimplenciaDiariaPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more InadimplenciaDiarias.
     * @param {InadimplenciaDiariaDeleteManyArgs} args - Arguments to filter InadimplenciaDiarias to delete.
     * @example
     * // Delete a few InadimplenciaDiarias
     * const { count } = await prisma.inadimplenciaDiaria.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends InadimplenciaDiariaDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, InadimplenciaDiariaDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InadimplenciaDiarias.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InadimplenciaDiariaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InadimplenciaDiarias
     * const inadimplenciaDiaria = await prisma.inadimplenciaDiaria.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends InadimplenciaDiariaUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, InadimplenciaDiariaUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one InadimplenciaDiaria.
     * @param {InadimplenciaDiariaUpsertArgs} args - Arguments to update or create a InadimplenciaDiaria.
     * @example
     * // Update or create a InadimplenciaDiaria
     * const inadimplenciaDiaria = await prisma.inadimplenciaDiaria.upsert({
     *   create: {
     *     // ... data to create a InadimplenciaDiaria
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InadimplenciaDiaria we want to update
     *   }
     * })
    **/
    upsert<T extends InadimplenciaDiariaUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, InadimplenciaDiariaUpsertArgs<ExtArgs>>
    ): Prisma__InadimplenciaDiariaClient<$Result.GetResult<Prisma.$InadimplenciaDiariaPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of InadimplenciaDiarias.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InadimplenciaDiariaCountArgs} args - Arguments to filter InadimplenciaDiarias to count.
     * @example
     * // Count the number of InadimplenciaDiarias
     * const count = await prisma.inadimplenciaDiaria.count({
     *   where: {
     *     // ... the filter for the InadimplenciaDiarias we want to count
     *   }
     * })
    **/
    count<T extends InadimplenciaDiariaCountArgs>(
      args?: Subset<T, InadimplenciaDiariaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InadimplenciaDiariaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InadimplenciaDiaria.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InadimplenciaDiariaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InadimplenciaDiariaAggregateArgs>(args: Subset<T, InadimplenciaDiariaAggregateArgs>): Prisma.PrismaPromise<GetInadimplenciaDiariaAggregateType<T>>

    /**
     * Group by InadimplenciaDiaria.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InadimplenciaDiariaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InadimplenciaDiariaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InadimplenciaDiariaGroupByArgs['orderBy'] }
        : { orderBy?: InadimplenciaDiariaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InadimplenciaDiariaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInadimplenciaDiariaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InadimplenciaDiaria model
   */
  readonly fields: InadimplenciaDiariaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InadimplenciaDiaria.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InadimplenciaDiariaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';


    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the InadimplenciaDiaria model
   */ 
  interface InadimplenciaDiariaFieldRefs {
    readonly id: FieldRef<"InadimplenciaDiaria", 'Int'>
    readonly dataReferencia: FieldRef<"InadimplenciaDiaria", 'DateTime'>
    readonly valorTotal: FieldRef<"InadimplenciaDiaria", 'Float'>
    readonly detalhes: FieldRef<"InadimplenciaDiaria", 'String'>
    readonly dataExecucao: FieldRef<"InadimplenciaDiaria", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * InadimplenciaDiaria findUnique
   */
  export type InadimplenciaDiariaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InadimplenciaDiaria
     */
    select?: InadimplenciaDiariaSelect<ExtArgs> | null
    /**
     * Filter, which InadimplenciaDiaria to fetch.
     */
    where: InadimplenciaDiariaWhereUniqueInput
  }

  /**
   * InadimplenciaDiaria findUniqueOrThrow
   */
  export type InadimplenciaDiariaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InadimplenciaDiaria
     */
    select?: InadimplenciaDiariaSelect<ExtArgs> | null
    /**
     * Filter, which InadimplenciaDiaria to fetch.
     */
    where: InadimplenciaDiariaWhereUniqueInput
  }

  /**
   * InadimplenciaDiaria findFirst
   */
  export type InadimplenciaDiariaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InadimplenciaDiaria
     */
    select?: InadimplenciaDiariaSelect<ExtArgs> | null
    /**
     * Filter, which InadimplenciaDiaria to fetch.
     */
    where?: InadimplenciaDiariaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InadimplenciaDiarias to fetch.
     */
    orderBy?: InadimplenciaDiariaOrderByWithRelationInput | InadimplenciaDiariaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InadimplenciaDiarias.
     */
    cursor?: InadimplenciaDiariaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InadimplenciaDiarias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InadimplenciaDiarias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InadimplenciaDiarias.
     */
    distinct?: InadimplenciaDiariaScalarFieldEnum | InadimplenciaDiariaScalarFieldEnum[]
  }

  /**
   * InadimplenciaDiaria findFirstOrThrow
   */
  export type InadimplenciaDiariaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InadimplenciaDiaria
     */
    select?: InadimplenciaDiariaSelect<ExtArgs> | null
    /**
     * Filter, which InadimplenciaDiaria to fetch.
     */
    where?: InadimplenciaDiariaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InadimplenciaDiarias to fetch.
     */
    orderBy?: InadimplenciaDiariaOrderByWithRelationInput | InadimplenciaDiariaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InadimplenciaDiarias.
     */
    cursor?: InadimplenciaDiariaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InadimplenciaDiarias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InadimplenciaDiarias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InadimplenciaDiarias.
     */
    distinct?: InadimplenciaDiariaScalarFieldEnum | InadimplenciaDiariaScalarFieldEnum[]
  }

  /**
   * InadimplenciaDiaria findMany
   */
  export type InadimplenciaDiariaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InadimplenciaDiaria
     */
    select?: InadimplenciaDiariaSelect<ExtArgs> | null
    /**
     * Filter, which InadimplenciaDiarias to fetch.
     */
    where?: InadimplenciaDiariaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InadimplenciaDiarias to fetch.
     */
    orderBy?: InadimplenciaDiariaOrderByWithRelationInput | InadimplenciaDiariaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InadimplenciaDiarias.
     */
    cursor?: InadimplenciaDiariaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InadimplenciaDiarias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InadimplenciaDiarias.
     */
    skip?: number
    distinct?: InadimplenciaDiariaScalarFieldEnum | InadimplenciaDiariaScalarFieldEnum[]
  }

  /**
   * InadimplenciaDiaria create
   */
  export type InadimplenciaDiariaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InadimplenciaDiaria
     */
    select?: InadimplenciaDiariaSelect<ExtArgs> | null
    /**
     * The data needed to create a InadimplenciaDiaria.
     */
    data: XOR<InadimplenciaDiariaCreateInput, InadimplenciaDiariaUncheckedCreateInput>
  }

  /**
   * InadimplenciaDiaria createMany
   */
  export type InadimplenciaDiariaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InadimplenciaDiarias.
     */
    data: InadimplenciaDiariaCreateManyInput | InadimplenciaDiariaCreateManyInput[]
  }

  /**
   * InadimplenciaDiaria createManyAndReturn
   */
  export type InadimplenciaDiariaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InadimplenciaDiaria
     */
    select?: InadimplenciaDiariaSelect<ExtArgs> | null
    /**
     * The data used to create many InadimplenciaDiarias.
     */
    data: InadimplenciaDiariaCreateManyInput | InadimplenciaDiariaCreateManyInput[]
  }

  /**
   * InadimplenciaDiaria update
   */
  export type InadimplenciaDiariaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InadimplenciaDiaria
     */
    select?: InadimplenciaDiariaSelect<ExtArgs> | null
    /**
     * The data needed to update a InadimplenciaDiaria.
     */
    data: XOR<InadimplenciaDiariaUpdateInput, InadimplenciaDiariaUncheckedUpdateInput>
    /**
     * Choose, which InadimplenciaDiaria to update.
     */
    where: InadimplenciaDiariaWhereUniqueInput
  }

  /**
   * InadimplenciaDiaria updateMany
   */
  export type InadimplenciaDiariaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InadimplenciaDiarias.
     */
    data: XOR<InadimplenciaDiariaUpdateManyMutationInput, InadimplenciaDiariaUncheckedUpdateManyInput>
    /**
     * Filter which InadimplenciaDiarias to update
     */
    where?: InadimplenciaDiariaWhereInput
  }

  /**
   * InadimplenciaDiaria upsert
   */
  export type InadimplenciaDiariaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InadimplenciaDiaria
     */
    select?: InadimplenciaDiariaSelect<ExtArgs> | null
    /**
     * The filter to search for the InadimplenciaDiaria to update in case it exists.
     */
    where: InadimplenciaDiariaWhereUniqueInput
    /**
     * In case the InadimplenciaDiaria found by the `where` argument doesn't exist, create a new InadimplenciaDiaria with this data.
     */
    create: XOR<InadimplenciaDiariaCreateInput, InadimplenciaDiariaUncheckedCreateInput>
    /**
     * In case the InadimplenciaDiaria was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InadimplenciaDiariaUpdateInput, InadimplenciaDiariaUncheckedUpdateInput>
  }

  /**
   * InadimplenciaDiaria delete
   */
  export type InadimplenciaDiariaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InadimplenciaDiaria
     */
    select?: InadimplenciaDiariaSelect<ExtArgs> | null
    /**
     * Filter which InadimplenciaDiaria to delete.
     */
    where: InadimplenciaDiariaWhereUniqueInput
  }

  /**
   * InadimplenciaDiaria deleteMany
   */
  export type InadimplenciaDiariaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InadimplenciaDiarias to delete
     */
    where?: InadimplenciaDiariaWhereInput
  }

  /**
   * InadimplenciaDiaria without action
   */
  export type InadimplenciaDiariaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InadimplenciaDiaria
     */
    select?: InadimplenciaDiariaSelect<ExtArgs> | null
  }


  /**
   * Model DashboardAggregates
   */

  export type AggregateDashboardAggregates = {
    _count: DashboardAggregatesCountAggregateOutputType | null
    _avg: DashboardAggregatesAvgAggregateOutputType | null
    _sum: DashboardAggregatesSumAggregateOutputType | null
    _min: DashboardAggregatesMinAggregateOutputType | null
    _max: DashboardAggregatesMaxAggregateOutputType | null
  }

  export type DashboardAggregatesAvgAggregateOutputType = {
    id: number | null
    idImovel: number | null
    total: number | null
  }

  export type DashboardAggregatesSumAggregateOutputType = {
    id: number | null
    idImovel: number | null
    total: number | null
  }

  export type DashboardAggregatesMinAggregateOutputType = {
    id: number | null
    idImovel: number | null
    tipo: string | null
    data: Date | null
    total: number | null
  }

  export type DashboardAggregatesMaxAggregateOutputType = {
    id: number | null
    idImovel: number | null
    tipo: string | null
    data: Date | null
    total: number | null
  }

  export type DashboardAggregatesCountAggregateOutputType = {
    id: number
    idImovel: number
    tipo: number
    data: number
    total: number
    _all: number
  }


  export type DashboardAggregatesAvgAggregateInputType = {
    id?: true
    idImovel?: true
    total?: true
  }

  export type DashboardAggregatesSumAggregateInputType = {
    id?: true
    idImovel?: true
    total?: true
  }

  export type DashboardAggregatesMinAggregateInputType = {
    id?: true
    idImovel?: true
    tipo?: true
    data?: true
    total?: true
  }

  export type DashboardAggregatesMaxAggregateInputType = {
    id?: true
    idImovel?: true
    tipo?: true
    data?: true
    total?: true
  }

  export type DashboardAggregatesCountAggregateInputType = {
    id?: true
    idImovel?: true
    tipo?: true
    data?: true
    total?: true
    _all?: true
  }

  export type DashboardAggregatesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DashboardAggregates to aggregate.
     */
    where?: DashboardAggregatesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DashboardAggregates to fetch.
     */
    orderBy?: DashboardAggregatesOrderByWithRelationInput | DashboardAggregatesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DashboardAggregatesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DashboardAggregates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DashboardAggregates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DashboardAggregates
    **/
    _count?: true | DashboardAggregatesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DashboardAggregatesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DashboardAggregatesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DashboardAggregatesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DashboardAggregatesMaxAggregateInputType
  }

  export type GetDashboardAggregatesAggregateType<T extends DashboardAggregatesAggregateArgs> = {
        [P in keyof T & keyof AggregateDashboardAggregates]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDashboardAggregates[P]>
      : GetScalarType<T[P], AggregateDashboardAggregates[P]>
  }




  export type DashboardAggregatesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DashboardAggregatesWhereInput
    orderBy?: DashboardAggregatesOrderByWithAggregationInput | DashboardAggregatesOrderByWithAggregationInput[]
    by: DashboardAggregatesScalarFieldEnum[] | DashboardAggregatesScalarFieldEnum
    having?: DashboardAggregatesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DashboardAggregatesCountAggregateInputType | true
    _avg?: DashboardAggregatesAvgAggregateInputType
    _sum?: DashboardAggregatesSumAggregateInputType
    _min?: DashboardAggregatesMinAggregateInputType
    _max?: DashboardAggregatesMaxAggregateInputType
  }

  export type DashboardAggregatesGroupByOutputType = {
    id: number
    idImovel: number
    tipo: string
    data: Date
    total: number
    _count: DashboardAggregatesCountAggregateOutputType | null
    _avg: DashboardAggregatesAvgAggregateOutputType | null
    _sum: DashboardAggregatesSumAggregateOutputType | null
    _min: DashboardAggregatesMinAggregateOutputType | null
    _max: DashboardAggregatesMaxAggregateOutputType | null
  }

  type GetDashboardAggregatesGroupByPayload<T extends DashboardAggregatesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DashboardAggregatesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DashboardAggregatesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DashboardAggregatesGroupByOutputType[P]>
            : GetScalarType<T[P], DashboardAggregatesGroupByOutputType[P]>
        }
      >
    >


  export type DashboardAggregatesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    idImovel?: boolean
    tipo?: boolean
    data?: boolean
    total?: boolean
  }, ExtArgs["result"]["dashboardAggregates"]>

  export type DashboardAggregatesSelectScalar = {
    id?: boolean
    idImovel?: boolean
    tipo?: boolean
    data?: boolean
    total?: boolean
  }



  export type $DashboardAggregatesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DashboardAggregates"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      idImovel: number
      tipo: string
      data: Date
      total: number
    }, ExtArgs["result"]["dashboardAggregates"]>
    composites: {}
  }


  type DashboardAggregatesGetPayload<S extends boolean | null | undefined | DashboardAggregatesDefaultArgs> = $Result.GetResult<Prisma.$DashboardAggregatesPayload, S>

  type DashboardAggregatesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DashboardAggregatesFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DashboardAggregatesCountAggregateInputType | true
    }

  export interface DashboardAggregatesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DashboardAggregates'], meta: { name: 'DashboardAggregates' } }
    /**
     * Find zero or one DashboardAggregates that matches the filter.
     * @param {DashboardAggregatesFindUniqueArgs} args - Arguments to find a DashboardAggregates
     * @example
     * // Get one DashboardAggregates
     * const dashboardAggregates = await prisma.dashboardAggregates.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends DashboardAggregatesFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, DashboardAggregatesFindUniqueArgs<ExtArgs>>
    ): Prisma__DashboardAggregatesClient<$Result.GetResult<Prisma.$DashboardAggregatesPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one DashboardAggregates that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DashboardAggregatesFindUniqueOrThrowArgs} args - Arguments to find a DashboardAggregates
     * @example
     * // Get one DashboardAggregates
     * const dashboardAggregates = await prisma.dashboardAggregates.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends DashboardAggregatesFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, DashboardAggregatesFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__DashboardAggregatesClient<$Result.GetResult<Prisma.$DashboardAggregatesPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first DashboardAggregates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DashboardAggregatesFindFirstArgs} args - Arguments to find a DashboardAggregates
     * @example
     * // Get one DashboardAggregates
     * const dashboardAggregates = await prisma.dashboardAggregates.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends DashboardAggregatesFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, DashboardAggregatesFindFirstArgs<ExtArgs>>
    ): Prisma__DashboardAggregatesClient<$Result.GetResult<Prisma.$DashboardAggregatesPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first DashboardAggregates that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DashboardAggregatesFindFirstOrThrowArgs} args - Arguments to find a DashboardAggregates
     * @example
     * // Get one DashboardAggregates
     * const dashboardAggregates = await prisma.dashboardAggregates.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends DashboardAggregatesFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, DashboardAggregatesFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__DashboardAggregatesClient<$Result.GetResult<Prisma.$DashboardAggregatesPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more DashboardAggregates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DashboardAggregatesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DashboardAggregates
     * const dashboardAggregates = await prisma.dashboardAggregates.findMany()
     * 
     * // Get first 10 DashboardAggregates
     * const dashboardAggregates = await prisma.dashboardAggregates.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dashboardAggregatesWithIdOnly = await prisma.dashboardAggregates.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends DashboardAggregatesFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, DashboardAggregatesFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DashboardAggregatesPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a DashboardAggregates.
     * @param {DashboardAggregatesCreateArgs} args - Arguments to create a DashboardAggregates.
     * @example
     * // Create one DashboardAggregates
     * const DashboardAggregates = await prisma.dashboardAggregates.create({
     *   data: {
     *     // ... data to create a DashboardAggregates
     *   }
     * })
     * 
    **/
    create<T extends DashboardAggregatesCreateArgs<ExtArgs>>(
      args: SelectSubset<T, DashboardAggregatesCreateArgs<ExtArgs>>
    ): Prisma__DashboardAggregatesClient<$Result.GetResult<Prisma.$DashboardAggregatesPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many DashboardAggregates.
     * @param {DashboardAggregatesCreateManyArgs} args - Arguments to create many DashboardAggregates.
     * @example
     * // Create many DashboardAggregates
     * const dashboardAggregates = await prisma.dashboardAggregates.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
    **/
    createMany<T extends DashboardAggregatesCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, DashboardAggregatesCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DashboardAggregates and returns the data saved in the database.
     * @param {DashboardAggregatesCreateManyAndReturnArgs} args - Arguments to create many DashboardAggregates.
     * @example
     * // Create many DashboardAggregates
     * const dashboardAggregates = await prisma.dashboardAggregates.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DashboardAggregates and only return the `id`
     * const dashboardAggregatesWithIdOnly = await prisma.dashboardAggregates.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
    **/
    createManyAndReturn<T extends DashboardAggregatesCreateManyAndReturnArgs<ExtArgs>>(
      args?: SelectSubset<T, DashboardAggregatesCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DashboardAggregatesPayload<ExtArgs>, T, 'createManyAndReturn'>>

    /**
     * Delete a DashboardAggregates.
     * @param {DashboardAggregatesDeleteArgs} args - Arguments to delete one DashboardAggregates.
     * @example
     * // Delete one DashboardAggregates
     * const DashboardAggregates = await prisma.dashboardAggregates.delete({
     *   where: {
     *     // ... filter to delete one DashboardAggregates
     *   }
     * })
     * 
    **/
    delete<T extends DashboardAggregatesDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, DashboardAggregatesDeleteArgs<ExtArgs>>
    ): Prisma__DashboardAggregatesClient<$Result.GetResult<Prisma.$DashboardAggregatesPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one DashboardAggregates.
     * @param {DashboardAggregatesUpdateArgs} args - Arguments to update one DashboardAggregates.
     * @example
     * // Update one DashboardAggregates
     * const dashboardAggregates = await prisma.dashboardAggregates.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends DashboardAggregatesUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, DashboardAggregatesUpdateArgs<ExtArgs>>
    ): Prisma__DashboardAggregatesClient<$Result.GetResult<Prisma.$DashboardAggregatesPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more DashboardAggregates.
     * @param {DashboardAggregatesDeleteManyArgs} args - Arguments to filter DashboardAggregates to delete.
     * @example
     * // Delete a few DashboardAggregates
     * const { count } = await prisma.dashboardAggregates.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends DashboardAggregatesDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, DashboardAggregatesDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DashboardAggregates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DashboardAggregatesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DashboardAggregates
     * const dashboardAggregates = await prisma.dashboardAggregates.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends DashboardAggregatesUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, DashboardAggregatesUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one DashboardAggregates.
     * @param {DashboardAggregatesUpsertArgs} args - Arguments to update or create a DashboardAggregates.
     * @example
     * // Update or create a DashboardAggregates
     * const dashboardAggregates = await prisma.dashboardAggregates.upsert({
     *   create: {
     *     // ... data to create a DashboardAggregates
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DashboardAggregates we want to update
     *   }
     * })
    **/
    upsert<T extends DashboardAggregatesUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, DashboardAggregatesUpsertArgs<ExtArgs>>
    ): Prisma__DashboardAggregatesClient<$Result.GetResult<Prisma.$DashboardAggregatesPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of DashboardAggregates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DashboardAggregatesCountArgs} args - Arguments to filter DashboardAggregates to count.
     * @example
     * // Count the number of DashboardAggregates
     * const count = await prisma.dashboardAggregates.count({
     *   where: {
     *     // ... the filter for the DashboardAggregates we want to count
     *   }
     * })
    **/
    count<T extends DashboardAggregatesCountArgs>(
      args?: Subset<T, DashboardAggregatesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DashboardAggregatesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DashboardAggregates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DashboardAggregatesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DashboardAggregatesAggregateArgs>(args: Subset<T, DashboardAggregatesAggregateArgs>): Prisma.PrismaPromise<GetDashboardAggregatesAggregateType<T>>

    /**
     * Group by DashboardAggregates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DashboardAggregatesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DashboardAggregatesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DashboardAggregatesGroupByArgs['orderBy'] }
        : { orderBy?: DashboardAggregatesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DashboardAggregatesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDashboardAggregatesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DashboardAggregates model
   */
  readonly fields: DashboardAggregatesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DashboardAggregates.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DashboardAggregatesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';


    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the DashboardAggregates model
   */ 
  interface DashboardAggregatesFieldRefs {
    readonly id: FieldRef<"DashboardAggregates", 'Int'>
    readonly idImovel: FieldRef<"DashboardAggregates", 'Int'>
    readonly tipo: FieldRef<"DashboardAggregates", 'String'>
    readonly data: FieldRef<"DashboardAggregates", 'DateTime'>
    readonly total: FieldRef<"DashboardAggregates", 'Float'>
  }
    

  // Custom InputTypes
  /**
   * DashboardAggregates findUnique
   */
  export type DashboardAggregatesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DashboardAggregates
     */
    select?: DashboardAggregatesSelect<ExtArgs> | null
    /**
     * Filter, which DashboardAggregates to fetch.
     */
    where: DashboardAggregatesWhereUniqueInput
  }

  /**
   * DashboardAggregates findUniqueOrThrow
   */
  export type DashboardAggregatesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DashboardAggregates
     */
    select?: DashboardAggregatesSelect<ExtArgs> | null
    /**
     * Filter, which DashboardAggregates to fetch.
     */
    where: DashboardAggregatesWhereUniqueInput
  }

  /**
   * DashboardAggregates findFirst
   */
  export type DashboardAggregatesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DashboardAggregates
     */
    select?: DashboardAggregatesSelect<ExtArgs> | null
    /**
     * Filter, which DashboardAggregates to fetch.
     */
    where?: DashboardAggregatesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DashboardAggregates to fetch.
     */
    orderBy?: DashboardAggregatesOrderByWithRelationInput | DashboardAggregatesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DashboardAggregates.
     */
    cursor?: DashboardAggregatesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DashboardAggregates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DashboardAggregates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DashboardAggregates.
     */
    distinct?: DashboardAggregatesScalarFieldEnum | DashboardAggregatesScalarFieldEnum[]
  }

  /**
   * DashboardAggregates findFirstOrThrow
   */
  export type DashboardAggregatesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DashboardAggregates
     */
    select?: DashboardAggregatesSelect<ExtArgs> | null
    /**
     * Filter, which DashboardAggregates to fetch.
     */
    where?: DashboardAggregatesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DashboardAggregates to fetch.
     */
    orderBy?: DashboardAggregatesOrderByWithRelationInput | DashboardAggregatesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DashboardAggregates.
     */
    cursor?: DashboardAggregatesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DashboardAggregates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DashboardAggregates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DashboardAggregates.
     */
    distinct?: DashboardAggregatesScalarFieldEnum | DashboardAggregatesScalarFieldEnum[]
  }

  /**
   * DashboardAggregates findMany
   */
  export type DashboardAggregatesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DashboardAggregates
     */
    select?: DashboardAggregatesSelect<ExtArgs> | null
    /**
     * Filter, which DashboardAggregates to fetch.
     */
    where?: DashboardAggregatesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DashboardAggregates to fetch.
     */
    orderBy?: DashboardAggregatesOrderByWithRelationInput | DashboardAggregatesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DashboardAggregates.
     */
    cursor?: DashboardAggregatesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DashboardAggregates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DashboardAggregates.
     */
    skip?: number
    distinct?: DashboardAggregatesScalarFieldEnum | DashboardAggregatesScalarFieldEnum[]
  }

  /**
   * DashboardAggregates create
   */
  export type DashboardAggregatesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DashboardAggregates
     */
    select?: DashboardAggregatesSelect<ExtArgs> | null
    /**
     * The data needed to create a DashboardAggregates.
     */
    data: XOR<DashboardAggregatesCreateInput, DashboardAggregatesUncheckedCreateInput>
  }

  /**
   * DashboardAggregates createMany
   */
  export type DashboardAggregatesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DashboardAggregates.
     */
    data: DashboardAggregatesCreateManyInput | DashboardAggregatesCreateManyInput[]
  }

  /**
   * DashboardAggregates createManyAndReturn
   */
  export type DashboardAggregatesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DashboardAggregates
     */
    select?: DashboardAggregatesSelect<ExtArgs> | null
    /**
     * The data used to create many DashboardAggregates.
     */
    data: DashboardAggregatesCreateManyInput | DashboardAggregatesCreateManyInput[]
  }

  /**
   * DashboardAggregates update
   */
  export type DashboardAggregatesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DashboardAggregates
     */
    select?: DashboardAggregatesSelect<ExtArgs> | null
    /**
     * The data needed to update a DashboardAggregates.
     */
    data: XOR<DashboardAggregatesUpdateInput, DashboardAggregatesUncheckedUpdateInput>
    /**
     * Choose, which DashboardAggregates to update.
     */
    where: DashboardAggregatesWhereUniqueInput
  }

  /**
   * DashboardAggregates updateMany
   */
  export type DashboardAggregatesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DashboardAggregates.
     */
    data: XOR<DashboardAggregatesUpdateManyMutationInput, DashboardAggregatesUncheckedUpdateManyInput>
    /**
     * Filter which DashboardAggregates to update
     */
    where?: DashboardAggregatesWhereInput
  }

  /**
   * DashboardAggregates upsert
   */
  export type DashboardAggregatesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DashboardAggregates
     */
    select?: DashboardAggregatesSelect<ExtArgs> | null
    /**
     * The filter to search for the DashboardAggregates to update in case it exists.
     */
    where: DashboardAggregatesWhereUniqueInput
    /**
     * In case the DashboardAggregates found by the `where` argument doesn't exist, create a new DashboardAggregates with this data.
     */
    create: XOR<DashboardAggregatesCreateInput, DashboardAggregatesUncheckedCreateInput>
    /**
     * In case the DashboardAggregates was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DashboardAggregatesUpdateInput, DashboardAggregatesUncheckedUpdateInput>
  }

  /**
   * DashboardAggregates delete
   */
  export type DashboardAggregatesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DashboardAggregates
     */
    select?: DashboardAggregatesSelect<ExtArgs> | null
    /**
     * Filter which DashboardAggregates to delete.
     */
    where: DashboardAggregatesWhereUniqueInput
  }

  /**
   * DashboardAggregates deleteMany
   */
  export type DashboardAggregatesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DashboardAggregates to delete
     */
    where?: DashboardAggregatesWhereInput
  }

  /**
   * DashboardAggregates without action
   */
  export type DashboardAggregatesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DashboardAggregates
     */
    select?: DashboardAggregatesSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const InadimplenciaDiariaScalarFieldEnum: {
    id: 'id',
    dataReferencia: 'dataReferencia',
    valorTotal: 'valorTotal',
    detalhes: 'detalhes',
    dataExecucao: 'dataExecucao'
  };

  export type InadimplenciaDiariaScalarFieldEnum = (typeof InadimplenciaDiariaScalarFieldEnum)[keyof typeof InadimplenciaDiariaScalarFieldEnum]


  export const DashboardAggregatesScalarFieldEnum: {
    id: 'id',
    idImovel: 'idImovel',
    tipo: 'tipo',
    data: 'data',
    total: 'total'
  };

  export type DashboardAggregatesScalarFieldEnum = (typeof DashboardAggregatesScalarFieldEnum)[keyof typeof DashboardAggregatesScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    
  /**
   * Deep Input Types
   */


  export type InadimplenciaDiariaWhereInput = {
    AND?: InadimplenciaDiariaWhereInput | InadimplenciaDiariaWhereInput[]
    OR?: InadimplenciaDiariaWhereInput[]
    NOT?: InadimplenciaDiariaWhereInput | InadimplenciaDiariaWhereInput[]
    id?: IntFilter<"InadimplenciaDiaria"> | number
    dataReferencia?: DateTimeFilter<"InadimplenciaDiaria"> | Date | string
    valorTotal?: FloatFilter<"InadimplenciaDiaria"> | number
    detalhes?: StringNullableFilter<"InadimplenciaDiaria"> | string | null
    dataExecucao?: DateTimeFilter<"InadimplenciaDiaria"> | Date | string
  }

  export type InadimplenciaDiariaOrderByWithRelationInput = {
    id?: SortOrder
    dataReferencia?: SortOrder
    valorTotal?: SortOrder
    detalhes?: SortOrderInput | SortOrder
    dataExecucao?: SortOrder
  }

  export type InadimplenciaDiariaWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    dataReferencia?: Date | string
    AND?: InadimplenciaDiariaWhereInput | InadimplenciaDiariaWhereInput[]
    OR?: InadimplenciaDiariaWhereInput[]
    NOT?: InadimplenciaDiariaWhereInput | InadimplenciaDiariaWhereInput[]
    valorTotal?: FloatFilter<"InadimplenciaDiaria"> | number
    detalhes?: StringNullableFilter<"InadimplenciaDiaria"> | string | null
    dataExecucao?: DateTimeFilter<"InadimplenciaDiaria"> | Date | string
  }, "id" | "dataReferencia">

  export type InadimplenciaDiariaOrderByWithAggregationInput = {
    id?: SortOrder
    dataReferencia?: SortOrder
    valorTotal?: SortOrder
    detalhes?: SortOrderInput | SortOrder
    dataExecucao?: SortOrder
    _count?: InadimplenciaDiariaCountOrderByAggregateInput
    _avg?: InadimplenciaDiariaAvgOrderByAggregateInput
    _max?: InadimplenciaDiariaMaxOrderByAggregateInput
    _min?: InadimplenciaDiariaMinOrderByAggregateInput
    _sum?: InadimplenciaDiariaSumOrderByAggregateInput
  }

  export type InadimplenciaDiariaScalarWhereWithAggregatesInput = {
    AND?: InadimplenciaDiariaScalarWhereWithAggregatesInput | InadimplenciaDiariaScalarWhereWithAggregatesInput[]
    OR?: InadimplenciaDiariaScalarWhereWithAggregatesInput[]
    NOT?: InadimplenciaDiariaScalarWhereWithAggregatesInput | InadimplenciaDiariaScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"InadimplenciaDiaria"> | number
    dataReferencia?: DateTimeWithAggregatesFilter<"InadimplenciaDiaria"> | Date | string
    valorTotal?: FloatWithAggregatesFilter<"InadimplenciaDiaria"> | number
    detalhes?: StringNullableWithAggregatesFilter<"InadimplenciaDiaria"> | string | null
    dataExecucao?: DateTimeWithAggregatesFilter<"InadimplenciaDiaria"> | Date | string
  }

  export type DashboardAggregatesWhereInput = {
    AND?: DashboardAggregatesWhereInput | DashboardAggregatesWhereInput[]
    OR?: DashboardAggregatesWhereInput[]
    NOT?: DashboardAggregatesWhereInput | DashboardAggregatesWhereInput[]
    id?: IntFilter<"DashboardAggregates"> | number
    idImovel?: IntFilter<"DashboardAggregates"> | number
    tipo?: StringFilter<"DashboardAggregates"> | string
    data?: DateTimeFilter<"DashboardAggregates"> | Date | string
    total?: FloatFilter<"DashboardAggregates"> | number
  }

  export type DashboardAggregatesOrderByWithRelationInput = {
    id?: SortOrder
    idImovel?: SortOrder
    tipo?: SortOrder
    data?: SortOrder
    total?: SortOrder
  }

  export type DashboardAggregatesWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: DashboardAggregatesWhereInput | DashboardAggregatesWhereInput[]
    OR?: DashboardAggregatesWhereInput[]
    NOT?: DashboardAggregatesWhereInput | DashboardAggregatesWhereInput[]
    idImovel?: IntFilter<"DashboardAggregates"> | number
    tipo?: StringFilter<"DashboardAggregates"> | string
    data?: DateTimeFilter<"DashboardAggregates"> | Date | string
    total?: FloatFilter<"DashboardAggregates"> | number
  }, "id">

  export type DashboardAggregatesOrderByWithAggregationInput = {
    id?: SortOrder
    idImovel?: SortOrder
    tipo?: SortOrder
    data?: SortOrder
    total?: SortOrder
    _count?: DashboardAggregatesCountOrderByAggregateInput
    _avg?: DashboardAggregatesAvgOrderByAggregateInput
    _max?: DashboardAggregatesMaxOrderByAggregateInput
    _min?: DashboardAggregatesMinOrderByAggregateInput
    _sum?: DashboardAggregatesSumOrderByAggregateInput
  }

  export type DashboardAggregatesScalarWhereWithAggregatesInput = {
    AND?: DashboardAggregatesScalarWhereWithAggregatesInput | DashboardAggregatesScalarWhereWithAggregatesInput[]
    OR?: DashboardAggregatesScalarWhereWithAggregatesInput[]
    NOT?: DashboardAggregatesScalarWhereWithAggregatesInput | DashboardAggregatesScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"DashboardAggregates"> | number
    idImovel?: IntWithAggregatesFilter<"DashboardAggregates"> | number
    tipo?: StringWithAggregatesFilter<"DashboardAggregates"> | string
    data?: DateTimeWithAggregatesFilter<"DashboardAggregates"> | Date | string
    total?: FloatWithAggregatesFilter<"DashboardAggregates"> | number
  }

  export type InadimplenciaDiariaCreateInput = {
    dataReferencia: Date | string
    valorTotal: number
    detalhes?: string | null
    dataExecucao?: Date | string
  }

  export type InadimplenciaDiariaUncheckedCreateInput = {
    id?: number
    dataReferencia: Date | string
    valorTotal: number
    detalhes?: string | null
    dataExecucao?: Date | string
  }

  export type InadimplenciaDiariaUpdateInput = {
    dataReferencia?: DateTimeFieldUpdateOperationsInput | Date | string
    valorTotal?: FloatFieldUpdateOperationsInput | number
    detalhes?: NullableStringFieldUpdateOperationsInput | string | null
    dataExecucao?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InadimplenciaDiariaUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    dataReferencia?: DateTimeFieldUpdateOperationsInput | Date | string
    valorTotal?: FloatFieldUpdateOperationsInput | number
    detalhes?: NullableStringFieldUpdateOperationsInput | string | null
    dataExecucao?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InadimplenciaDiariaCreateManyInput = {
    id?: number
    dataReferencia: Date | string
    valorTotal: number
    detalhes?: string | null
    dataExecucao?: Date | string
  }

  export type InadimplenciaDiariaUpdateManyMutationInput = {
    dataReferencia?: DateTimeFieldUpdateOperationsInput | Date | string
    valorTotal?: FloatFieldUpdateOperationsInput | number
    detalhes?: NullableStringFieldUpdateOperationsInput | string | null
    dataExecucao?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InadimplenciaDiariaUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    dataReferencia?: DateTimeFieldUpdateOperationsInput | Date | string
    valorTotal?: FloatFieldUpdateOperationsInput | number
    detalhes?: NullableStringFieldUpdateOperationsInput | string | null
    dataExecucao?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DashboardAggregatesCreateInput = {
    idImovel: number
    tipo: string
    data: Date | string
    total: number
  }

  export type DashboardAggregatesUncheckedCreateInput = {
    id?: number
    idImovel: number
    tipo: string
    data: Date | string
    total: number
  }

  export type DashboardAggregatesUpdateInput = {
    idImovel?: IntFieldUpdateOperationsInput | number
    tipo?: StringFieldUpdateOperationsInput | string
    data?: DateTimeFieldUpdateOperationsInput | Date | string
    total?: FloatFieldUpdateOperationsInput | number
  }

  export type DashboardAggregatesUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    idImovel?: IntFieldUpdateOperationsInput | number
    tipo?: StringFieldUpdateOperationsInput | string
    data?: DateTimeFieldUpdateOperationsInput | Date | string
    total?: FloatFieldUpdateOperationsInput | number
  }

  export type DashboardAggregatesCreateManyInput = {
    id?: number
    idImovel: number
    tipo: string
    data: Date | string
    total: number
  }

  export type DashboardAggregatesUpdateManyMutationInput = {
    idImovel?: IntFieldUpdateOperationsInput | number
    tipo?: StringFieldUpdateOperationsInput | string
    data?: DateTimeFieldUpdateOperationsInput | Date | string
    total?: FloatFieldUpdateOperationsInput | number
  }

  export type DashboardAggregatesUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    idImovel?: IntFieldUpdateOperationsInput | number
    tipo?: StringFieldUpdateOperationsInput | string
    data?: DateTimeFieldUpdateOperationsInput | Date | string
    total?: FloatFieldUpdateOperationsInput | number
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type InadimplenciaDiariaCountOrderByAggregateInput = {
    id?: SortOrder
    dataReferencia?: SortOrder
    valorTotal?: SortOrder
    detalhes?: SortOrder
    dataExecucao?: SortOrder
  }

  export type InadimplenciaDiariaAvgOrderByAggregateInput = {
    id?: SortOrder
    valorTotal?: SortOrder
  }

  export type InadimplenciaDiariaMaxOrderByAggregateInput = {
    id?: SortOrder
    dataReferencia?: SortOrder
    valorTotal?: SortOrder
    detalhes?: SortOrder
    dataExecucao?: SortOrder
  }

  export type InadimplenciaDiariaMinOrderByAggregateInput = {
    id?: SortOrder
    dataReferencia?: SortOrder
    valorTotal?: SortOrder
    detalhes?: SortOrder
    dataExecucao?: SortOrder
  }

  export type InadimplenciaDiariaSumOrderByAggregateInput = {
    id?: SortOrder
    valorTotal?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DashboardAggregatesCountOrderByAggregateInput = {
    id?: SortOrder
    idImovel?: SortOrder
    tipo?: SortOrder
    data?: SortOrder
    total?: SortOrder
  }

  export type DashboardAggregatesAvgOrderByAggregateInput = {
    id?: SortOrder
    idImovel?: SortOrder
    total?: SortOrder
  }

  export type DashboardAggregatesMaxOrderByAggregateInput = {
    id?: SortOrder
    idImovel?: SortOrder
    tipo?: SortOrder
    data?: SortOrder
    total?: SortOrder
  }

  export type DashboardAggregatesMinOrderByAggregateInput = {
    id?: SortOrder
    idImovel?: SortOrder
    tipo?: SortOrder
    data?: SortOrder
    total?: SortOrder
  }

  export type DashboardAggregatesSumOrderByAggregateInput = {
    id?: SortOrder
    idImovel?: SortOrder
    total?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use InadimplenciaDiariaDefaultArgs instead
     */
    export type InadimplenciaDiariaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InadimplenciaDiariaDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DashboardAggregatesDefaultArgs instead
     */
    export type DashboardAggregatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DashboardAggregatesDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}