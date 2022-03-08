import { ComponentMeta, ComponentStory } from "@storybook/react";

import { LanguageSelector as LanguageSelectorComponent } from "./LanguageSelector";

export default {
  title: "LanguageSelector",
  component: LanguageSelectorComponent,
} as ComponentMeta<typeof LanguageSelectorComponent>;

export const LanguageSelector: ComponentStory<typeof LanguageSelectorComponent> = () => <LanguageSelectorComponent />;
