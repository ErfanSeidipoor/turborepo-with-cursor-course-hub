6. SUBTASK-06: Implement up and down methods

- Open the generated file under `packages/postgres/src/migrations/` and implement both `up` and `down` using TypeORM’s `QueryRunner`.
- Follow the guidance from @postgres.mdc:
  - Use helper utilities like `DatabaseCreateTable` and `DatabaseCreateForeignKey` when creating tables/relations.
  - For alters, prefer explicit operations: `addColumn`, `dropColumn`, `changeColumn`, `createIndex`, `dropIndex`, `createForeignKey`, `dropForeignKey` as appropriate.
  - Ensure `down` precisely reverses `up` in the correct order (drop FKs/indexes before dropping columns/tables).
  - Use snake_case for DB names; map to camelCase in entities via the `name` property.
  - consider enum fields they should be type:enum

- The migration file implementation (in `packages/postgres/src/migrations/`) **must** follow the standards and detailed guidance described in `packages/postgres/.cursor/rules/@postgres.md`. This includes:
  - Refer to `@postgres.md` for examples, required patterns, and additional context before writing or reviewing any migration code.
