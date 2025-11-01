9. SUBTASK-09: Update entities under packages/postgres/src/entities

- Reflect the schema changes in entity classes (see @postgres.mdc Entity Definition Checklist):
  - Ensure table name is explicit via `@Entity('table_name')`.
  - Add/alter/remove columns using camelCase properties with snake_case `name` mapping.
  - For enums, set `type: 'enum'` and `enum: YourEnum` and default if applicable.
  - Maintain relationships with correct `@ManyToOne`/`@OneToMany` annotations and FK column names.
  - Update `packages/postgres/src/entities/index.ts` if new entities were added.
  - follow the standards and detailed guidance described in `packages/postgres/.cursor/rules/@postgres.mdc`.

```ts
// Example column mapping
@Column({ name: 'status', type: 'enum', enum: OrderStatusEnum, default: OrderStatusEnum.PENDING })
status: OrderStatusEnum;
```
