/**
 * Local development bypass for auth + credits.
 *
 * Every AI server action gates on a Supabase session and a credit balance
 * before it reaches the model. With DEV_SKIP_AUTH=true the two Supabase
 * entry points (`createClient` and `supabaseAdmin`) hand back an in-memory
 * stub instead, so the actions run end to end against a fake signed-in user
 * with effectively unlimited credits.
 *
 * The stub keeps rows in a per-process Map and honours `eq`/`in` filters, so
 * multi-step flows work — a dream is written by analyzeDreamAction and read
 * back by visualizeDreamAction. Everything is lost when the server restarts.
 *
 * This is a convenience for running the app locally without a Supabase
 * project. It must never be enabled in production — the guard below refuses
 * to activate outside development.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

// The server reads DEV_SKIP_AUTH; the browser bundle only ever sees the
// NEXT_PUBLIC_ copy, so both spellings are accepted here.
export const DEV_SKIP_AUTH =
  (process.env.DEV_SKIP_AUTH === "true" ||
    process.env.NEXT_PUBLIC_DEV_SKIP_AUTH === "true") &&
  process.env.NODE_ENV !== "production";

export const DEV_USER = {
  id: "00000000-0000-4000-8000-000000000001",
  email: "dev@localhost",
  user_metadata: { name: "Local Traveler" },
};

const DEV_CREDITS = 9999;

type Row = Record<string, unknown>;

const store = new Map<string, Row[]>();

function table(name: string): Row[] {
  let rows = store.get(name);
  if (!rows) {
    // Seed the wallet the credit machinery expects to find.
    rows = name === "profiles" ? [{ id: DEV_USER.id, credits: DEV_CREDITS }] : [];
    store.set(name, rows);
  }
  return rows;
}

type Filter = { column: string; value: unknown };
type Op = "select" | "insert" | "update" | "upsert" | "delete";

/**
 * Chainable stand-in for the PostgREST query builder. Awaiting the chain — or
 * calling `single()` — runs it against the in-memory store.
 */
class DevQuery implements PromiseLike<{ data: unknown; error: null }> {
  private op: Op | null = null;
  private filters: Filter[] = [];
  private payload: Row | Row[] | null = null;
  private single_ = false;
  private limit_: number | null = null;
  private order_: { column: string; ascending: boolean } | null = null;

  constructor(private name: string) {}

  select() {
    // `.update(...).select()` must stay an update.
    if (!this.op) this.op = "select";
    return this;
  }

  insert(payload: Row | Row[]) {
    this.op = "insert";
    this.payload = payload;
    return this;
  }

  update(payload: Row) {
    this.op = "update";
    this.payload = payload;
    return this;
  }

  upsert(payload: Row | Row[]) {
    this.op = "upsert";
    this.payload = payload;
    return this;
  }

  delete() {
    this.op = "delete";
    return this;
  }

  eq(column: string, value: unknown) {
    this.filters.push({ column, value });
    return this;
  }

  in(column: string, values: unknown[]) {
    this.filters.push({ column, value: values });
    return this;
  }

  // Range filters are not meaningful against the tiny dev store.
  neq() { return this; }
  gt() { return this; }
  gte() { return this; }
  lt() { return this; }
  lte() { return this; }
  is() { return this; }
  like() { return this; }
  ilike() { return this; }
  match() { return this; }
  filter() { return this; }
  range() { return this; }

  order(column: string, options?: { ascending?: boolean }) {
    this.order_ = { column, ascending: options?.ascending !== false };
    return this;
  }

  limit(count: number) {
    this.limit_ = count;
    return this;
  }

  single() {
    this.single_ = true;
    return this;
  }

  maybeSingle() {
    this.single_ = true;
    return this;
  }

  private matches(row: Row): boolean {
    return this.filters.every(({ column, value }) =>
      Array.isArray(value) ? value.includes(row[column]) : row[column] === value
    );
  }

  private run(): unknown {
    const rows = table(this.name);
    const incoming = Array.isArray(this.payload)
      ? this.payload
      : this.payload
        ? [this.payload]
        : [];

    switch (this.op) {
      case "insert": {
        rows.push(...incoming);
        return this.shape(incoming);
      }

      case "upsert": {
        for (const row of incoming) {
          const index = rows.findIndex((existing) => existing.id === row.id);
          if (index >= 0) rows[index] = { ...rows[index], ...row };
          else rows.push(row);
        }
        return this.shape(incoming);
      }

      case "update": {
        const updated: Row[] = [];
        rows.forEach((row, index) => {
          if (!this.matches(row)) return;
          rows[index] = { ...row, ...incoming[0] };
          updated.push(rows[index]);
        });
        return this.shape(updated);
      }

      case "delete": {
        const kept = rows.filter((row) => !this.matches(row));
        store.set(this.name, kept);
        return this.shape([]);
      }

      default: {
        let found = rows.filter((row) => this.matches(row));
        if (this.order_) {
          const { column, ascending } = this.order_;
          found = [...found].sort((a, b) => {
            const left = Number(a[column] ?? 0);
            const right = Number(b[column] ?? 0);
            return ascending ? left - right : right - left;
          });
        }
        if (this.limit_ !== null) found = found.slice(0, this.limit_);
        return this.shape(found);
      }
    }
  }

  private shape(rows: Row[]): unknown {
    return this.single_ ? (rows[0] ?? null) : rows;
  }

  then<TResult1 = { data: unknown; error: null }, TResult2 = never>(
    onfulfilled?:
      | ((value: { data: unknown; error: null }) => TResult1 | PromiseLike<TResult1>)
      | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): PromiseLike<TResult1 | TResult2> {
    return Promise.resolve({ data: this.run(), error: null }).then(
      onfulfilled,
      onrejected
    );
  }
}

const devClient = {
  auth: {
    getUser: async () => ({ data: { user: DEV_USER }, error: null }),
    getSession: async () => ({
      data: { session: { user: DEV_USER } },
      error: null,
    }),
    signOut: async () => ({ error: null }),
  },
  from: (name: string) => new DevQuery(name),
};

export function createDevClient(): SupabaseClient {
  return devClient as unknown as SupabaseClient;
}
