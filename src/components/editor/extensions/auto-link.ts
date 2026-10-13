import { $isCodeNode } from "@lexical/code-core";
import {
  autoLinkEmailMatcher,
  autoLinkUrlMatcher,
  AutoLinkExtension as LexicalAutoLinkExtension,
} from "@lexical/link";
import { configExtension, defineExtension } from "lexical";

export const AutoLinkExtension = defineExtension({
  name: "@intentui-editor/editor/AutoLink",
  dependencies: [
    configExtension(LexicalAutoLinkExtension, {
      excludeParents: [$isCodeNode],
      matchers: [autoLinkUrlMatcher, autoLinkEmailMatcher],
    }),
  ],
});
