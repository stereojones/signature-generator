"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";

import type { TemplateWithHtml } from "@/lib/templates";

export type WizardStep = 1 | 2 | 3 | 4;

export type WizardState = {
  step: WizardStep;
  templateId: string | null;
  formData: Record<string, string>;
  headshotUrl: string | null;
};

type WizardAction =
  | { type: "SET_STEP"; step: WizardStep }
  | { type: "SELECT_TEMPLATE"; templateId: string }
  | { type: "UPDATE_FIELD"; key: string; value: string }
  | { type: "SET_FORM_DATA"; formData: Record<string, string> }
  | { type: "SET_HEADSHOT_URL"; url: string | null }
  | { type: "RESET" };

const initialState: WizardState = {
  step: 1,
  templateId: null,
  formData: {},
  headshotUrl: null,
};

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.step };
    case "SELECT_TEMPLATE":
      return {
        ...state,
        templateId: action.templateId,
        formData: {},
        headshotUrl: null,
      };
    case "UPDATE_FIELD":
      return {
        ...state,
        formData: { ...state.formData, [action.key]: action.value },
      };
    case "SET_FORM_DATA":
      return { ...state, formData: action.formData };
    case "SET_HEADSHOT_URL":
      return { ...state, headshotUrl: action.url };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

type WizardContextValue = {
  state: WizardState;
  templates: TemplateWithHtml[];
  selectedTemplate: TemplateWithHtml | null;
  setStep: (step: WizardStep) => void;
  selectTemplate: (templateId: string) => void;
  updateField: (key: string, value: string) => void;
  setHeadshotUrl: (url: string | null) => void;
  reset: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipHeadshotStep: () => void;
};

const WizardContext = createContext<WizardContextValue | null>(null);

export function WizardProvider({
  children,
  templates,
}: {
  children: ReactNode;
  templates: TemplateWithHtml[];
}) {
  const [state, dispatch] = useReducer(wizardReducer, initialState);

  const selectedTemplate = useMemo(
    () => templates.find((t) => t.id === state.templateId) ?? null,
    [templates, state.templateId],
  );

  const setStep = useCallback((step: WizardStep) => {
    dispatch({ type: "SET_STEP", step });
  }, []);

  const selectTemplate = useCallback((templateId: string) => {
    dispatch({ type: "SELECT_TEMPLATE", templateId });
  }, []);

  const updateField = useCallback((key: string, value: string) => {
    dispatch({ type: "UPDATE_FIELD", key, value });
  }, []);

  const setHeadshotUrl = useCallback((url: string | null) => {
    dispatch({ type: "SET_HEADSHOT_URL", url });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const nextStep = useCallback(() => {
    dispatch({
      type: "SET_STEP",
      step: Math.min(4, state.step + 1) as WizardStep,
    });
  }, [state.step]);

  const prevStep = useCallback(() => {
    const template = templates.find((t) => t.id === state.templateId);
    const skipHeadshot = template && !template.requiresHeadshot;

    if (skipHeadshot && state.step === 4) {
      dispatch({ type: "SET_STEP", step: 2 });
      return;
    }

    dispatch({
      type: "SET_STEP",
      step: Math.max(1, state.step - 1) as WizardStep,
    });
  }, [state.step, state.templateId, templates]);

  const skipHeadshotStep = useCallback(() => {
    dispatch({ type: "SET_STEP", step: 4 });
  }, []);

  const value = useMemo(
    () => ({
      state,
      templates,
      selectedTemplate,
      setStep,
      selectTemplate,
      updateField,
      setHeadshotUrl,
      reset,
      nextStep,
      prevStep,
      skipHeadshotStep,
    }),
    [
      state,
      templates,
      selectedTemplate,
      setStep,
      selectTemplate,
      updateField,
      setHeadshotUrl,
      reset,
      nextStep,
      prevStep,
      skipHeadshotStep,
    ],
  );

  return (
    <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
  );
}

export function useWizard(): WizardContextValue {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error("useWizard must be used within WizardProvider");
  }
  return context;
}
