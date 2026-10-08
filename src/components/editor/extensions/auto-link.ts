import { configExtension, defineExtension } from "lexical";

import { $isCodeNode } from "@lexical/code-core";
import {
  AutoLinkExtension as LexicalAutoLinkExtension,
  autoLinkEmailMatcher,
  autoLinkUrlMatcher,
} from "@lexical/link";

export const AutoLinkExtension = defineExtension({
  name: "@intentui-editor/editor/AutoLink",
  dependencies: [
    configExtension(LexicalAutoLinkExtension, {
      excludeParents: [$isCodeNode],
      matchers: [autoLinkUrlMatcher, autoLinkEmailMatcher],
    }),
  ],
});
