import { defineExtension } from "lexical";

import { MentionNode } from "@/components/editor/nodes/mention-node";

export const MentionExtension = defineExtension({
  name: "@intentui-editor/editor/Mention",
  nodes: () => [MentionNode],
});
