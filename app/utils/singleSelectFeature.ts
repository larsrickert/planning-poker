import {
  createFeature,
  DataGridFeatures,
  OnyxCheckbox,
  type DataGridEntry,
  type DataGridFeature,
} from "sit-onyx";

export type SingleSelectOptions<TEntry extends DataGridEntry> = {
  state: Ref<TEntry["id"] | undefined>;
};

const SELECTION_COLUMN = Symbol("selection-column");

export const useSingleSelect = <TEntry extends DataGridEntry>(
  options: SingleSelectOptions<TEntry>,
) =>
  createFeature((ctx) => {
    return {
      name: Symbol("single-select"),
      watch: [options.state],
      modifyColumns: {
        func: (columns) => {
          return [
            {
              key: SELECTION_COLUMN,
              type: { name: SELECTION_COLUMN },
              label: "",
              width: "2.5rem",
            },
            ...columns,
          ];
        },
      },
      typeRenderer: {
        [SELECTION_COLUMN]: DataGridFeatures.createTypeRenderer({
          cell: {
            tdAttributes: {
              // styles provided by onyx
              class: "onyx-data-grid-selection-cell",
            },
            component: ({ row }) => {
              const idAsString = String(row.id);
              const isChecked = options.state.value === row.id;
              const label = ctx.i18n.t.value("dataGrid.head.selection.select", { id: idAsString });

              return h(OnyxCheckbox, {
                label,
                value: `selection-${String(row.id)}`,
                hideLabel: true,
                modelValue: isChecked,
                disabled: !!ctx.skeleton.value,
                skeleton: ctx.skeleton.value,
                "onUpdate:modelValue": (checked) =>
                  (options.state.value = checked ? row.id : undefined),
              });
            },
          },
        }),
      },
    };
  }) as DataGridFeature<TEntry>;
