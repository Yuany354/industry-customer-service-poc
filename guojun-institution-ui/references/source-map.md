# MasterGo source map

- Source URL: `https://mastergo.com/goto/Vf7p5EQu?page_id=M&file=18385474232816`
- Resolved document ID: `183854742328163`
- Document name: `国君机构服务平台 WEB UI设计规范`
- Source update date shown in frames: `2026-01-14`
- MCP local library identity: `local-183854742328163`

## Snapshot coverage

MCP-managed snapshots were captured for:

- variables and local components;
- 1.1 standard colors and 1.2 standard styles;
- 2.1 regular typography and 2.2 text examples;
- 3.1 King Kong area, 3.2 linear icons, 3.3 functional/list/tag icons;
- 4.1 global spacing, 4.2 component internal spacing, 4.3 card page (source root labels it `4.4 卡片`);
- 5.1 banner imagery and 5.2 live/information imagery;
- 6.1 buttons, 6.2 tags, 6.3 navigation, 6.4 sidebar, 6.5 lists, 6.6 inputs, 6.7 selectors;
- 7.1 empty states and the footer page.

The 6.8 dialog root could not be serialized because the MasterGo server reported an unsupported deferred image resource. Its internal `*Notification*` node (`4:097637`) was read successfully and its executable dimensions/styles are recorded in `components.md`.

## Variable and component facts

- Formal variable collection: `集合`.
- Formal variable: `颜色`, type COLOR, mode `模式 1`, value `#ffffff`.
- Local component snapshot contains six components: four full-page 1440 × 2616 containers, one 54 × 54 component, and one 76 × 32 `Button` with default variant.
- `icons.json` is empty. Icon rules in this skill come from specification frames, not an exported icon package.

## Refresh procedure

When the source has changed materially:

1. connect the same document in MasterGo and ensure MCP is running;
2. refresh variables and the exact local component library `local-183854742328163`;
3. select each updated specification root and call the MasterGo selection snapshot reader;
4. compare values with `assets/tokens.json` and update only evidenced changes;
5. re-run the skill validator.

Do not scan sibling libraries or modify variables/components during a read-only refresh.
