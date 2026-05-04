"use client";

import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowUp, Paperclip, Square, X, StopCircle, Mic, ChevronDown, LayoutTemplate, Palette } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Embedded CSS for minimal custom styles
const styles = `
  *:focus-visible {
    outline-offset: 0 !important;
    --ring-offset: 0 !important;
  }
  textarea::-webkit-scrollbar {
    width: 6px;
  }
  textarea::-webkit-scrollbar-track {
    background: transparent;
  }
  textarea::-webkit-scrollbar-thumb {
    background-color: rgba(205, 0, 0, 0.2);
    border-radius: 3px;
  }
  textarea::-webkit-scrollbar-thumb:hover {
    background-color: rgba(205, 0, 0, 0.4);
  }
`;

if (typeof document !== 'undefined') {
  const styleElement = document.getElementById("prompt-input-styles");
  if (!styleElement) {
    const styleSheet = document.createElement("style");
    styleSheet.id = "prompt-input-styles";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
  }
}

// Textarea Component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "flex w-full rounded-md border-none bg-transparent px-3 py-2.5 text-[15px] leading-relaxed text-zinc-200 placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] resize-none scrollbar-thin scrollbar-thumb-[#cd0000]/20 scrollbar-track-transparent hover:scrollbar-thumb-[#cd0000]/40",
      className
    )}
    ref={ref}
    rows={1}
    {...props}
  />
));
Textarea.displayName = "Textarea";

// Tooltip Components
const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border border-white/10 bg-[#0a0a0a]/90 backdrop-blur-md px-3 py-1.5 text-xs text-zinc-300 shadow-xl animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

// Dialog Components
const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-[90vw] md:max-w-[800px] translate-x-[-50%] translate-y-[-50%] gap-4 border border-white/10 bg-[#0a0a0a] p-0 shadow-2xl duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 rounded-2xl",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 z-10 rounded-full bg-white/5 p-2 hover:bg-white/10 transition-all">
        <X className="h-5 w-5 text-zinc-400 hover:text-white" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight text-zinc-100", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variantClasses = {
      default: "bg-[#cd0000] hover:bg-[#a00000] text-white shadow-sm",
      outline: "border border-white/10 bg-transparent hover:bg-white/5 text-zinc-200",
      ghost: "bg-transparent hover:bg-white/5 text-zinc-200",
    };
    const sizeClasses = {
      default: "h-10 px-4 py-2",
      sm: "h-8 px-3 text-sm",
      lg: "h-12 px-6",
      icon: "h-8 w-8 rounded-full aspect-[1/1]",
    };
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// VoiceRecorder Component
interface VoiceRecorderProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: (duration: number) => void;
  visualizerBars?: number;
}
const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  isRecording,
  onStartRecording,
  onStopRecording,
  visualizerBars = 32,
}) => {
  const [time, setTime] = React.useState(0);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (isRecording) {
      onStartRecording();
      timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      onStopRecording(time);
      setTime(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, time, onStartRecording, onStopRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full transition-all duration-300 py-3",
        isRecording ? "opacity-100" : "opacity-0 h-0"
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="h-2 w-2 rounded-full bg-[#cd0000] animate-pulse" />
        <span className="font-mono text-sm text-zinc-300">{formatTime(time)}</span>
      </div>
      <div className="w-full h-10 flex items-center justify-center gap-0.5 px-4">
        {[...Array(visualizerBars)].map((_, i) => (
          <div
            key={i}
            className="w-0.5 rounded-full bg-[#cd0000]/50 animate-pulse"
            style={{
              height: `${Math.max(15, Math.random() * 100)}%`,
              animationDelay: `${i * 0.05}s`,
              animationDuration: `${0.5 + Math.random() * 0.5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

// ImageViewDialog Component
interface ImageViewDialogProps {
  imageUrl: string | null;
  onClose: () => void;
}
const ImageViewDialog: React.FC<ImageViewDialogProps> = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;
  return (
    <Dialog open={!!imageUrl} onOpenChange={onClose}>
      <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-[90vw] md:max-w-[800px]">
        <DialogTitle className="sr-only">Image Preview</DialogTitle>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative bg-[#0a0a0a] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        >
          <img
            src={imageUrl}
            alt="Full preview"
            className="w-full max-h-[80vh] object-contain rounded-2xl"
          />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

// PromptInput Context and Components
interface PromptInputContextType {
  isLoading: boolean;
  value: string;
  setValue: (value: string) => void;
  maxHeight: number | string;
  onSubmit?: () => void;
  disabled?: boolean;
}
const PromptInputContext = React.createContext<PromptInputContextType>({
  isLoading: false,
  value: "",
  setValue: () => { },
  maxHeight: 240,
  onSubmit: undefined,
  disabled: false,
});
function usePromptInput() {
  const context = React.useContext(PromptInputContext);
  if (!context) throw new Error("usePromptInput must be used within a PromptInput");
  return context;
}

interface PromptInputProps {
  isLoading?: boolean;
  value?: string;
  onValueChange?: (value: string) => void;
  maxHeight?: number | string;
  onSubmit?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}
const PromptInput = React.forwardRef<HTMLDivElement, PromptInputProps>(
  (
    {
      className,
      isLoading = false,
      maxHeight = 240,
      value,
      onValueChange,
      onSubmit,
      children,
      disabled = false,
      onDragOver,
      onDragLeave,
      onDrop,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(value || "");
    const handleChange = (newValue: string) => {
      setInternalValue(newValue);
      onValueChange?.(newValue);
    };
    return (
      <TooltipProvider>
        <PromptInputContext.Provider
          value={{
            isLoading,
            value: value ?? internalValue,
            setValue: onValueChange ?? handleChange,
            maxHeight,
            onSubmit,
            disabled,
          }}
        >
          <div
            ref={ref}
            className={cn(
              "rounded-3xl border border-white/[0.08] bg-[#0a0a0a]/80 backdrop-blur-xl p-2 shadow-[0_0_20px_rgba(0,0,0,0.4)] transition-all duration-300",
              isLoading && "border-[#cd0000]/50 shadow-[0_0_30px_rgba(205,0,0,0.15)]",
              className
            )}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            {children}
          </div>
        </PromptInputContext.Provider>
      </TooltipProvider>
    );
  }
);
PromptInput.displayName = "PromptInput";

interface PromptInputTextareaProps {
  disableAutosize?: boolean;
  placeholder?: string;
}
const PromptInputTextarea: React.FC<PromptInputTextareaProps & React.ComponentProps<typeof Textarea>> = ({
  className,
  onKeyDown,
  disableAutosize = false,
  placeholder,
  ...props
}) => {
  const { value, setValue, maxHeight, onSubmit, disabled } = usePromptInput();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (disableAutosize || !textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height =
      typeof maxHeight === "number"
        ? `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`
        : `min(${textareaRef.current.scrollHeight}px, ${maxHeight})`;
  }, [value, maxHeight, disableAutosize]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit?.();
    }
    onKeyDown?.(e);
  };

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      className={cn("text-[15px]", className)}
      disabled={disabled}
      placeholder={placeholder}
      {...props}
    />
  );
};

interface PromptInputActionsProps extends React.HTMLAttributes<HTMLDivElement> { }
const PromptInputActions: React.FC<PromptInputActionsProps> = ({ children, className, ...props }) => (
  <div className={cn("flex items-center gap-2", className)} {...props}>
    {children}
  </div>
);

interface PromptInputActionProps extends React.ComponentProps<typeof Tooltip> {
  tooltip: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}
const PromptInputAction: React.FC<PromptInputActionProps> = ({
  tooltip,
  children,
  className,
  side = "top",
  ...props
}) => {
  const { disabled } = usePromptInput();
  return (
    <Tooltip {...props}>
      <TooltipTrigger asChild disabled={disabled}>
        {children}
      </TooltipTrigger>
      <TooltipContent side={side} className={className}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
};

// Custom Divider Component
const CustomDivider: React.FC = () => (
  <div className="relative h-6 w-[1.5px] mx-1">
    <div className="absolute inset-0 bg-white/10 rounded-full" />
  </div>
);

// Model definitions
const MODELOS_DISPONIVEIS = [
  { id: "gemini-3.1-flash-lite-preview", nome: "Gemini 3.1 Flash Lite", descricao: "Rápido e leve" },
  { id: "gemini-2.5-flash", nome: "Gemini 2.5 Flash", descricao: "Avançado" },
] as const;

type ModeloId = typeof MODELOS_DISPONIVEIS[number]["id"];

// ModelSelector Component
interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  disabled?: boolean;
}
const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onModelChange, disabled }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const modeloAtual = MODELOS_DISPONIVEIS.find((m) => m.id === selectedModel) || MODELOS_DISPONIVEIS[0];

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        disabled={disabled}
        className={cn(
          "flex items-center gap-1.5 h-8 px-2.5 rounded-full transition-all duration-200 border",
          isOpen
            ? "bg-white/[0.08] border-white/20 text-zinc-200"
            : "bg-transparent border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.05]",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <img src="/gemini-logo.webp" alt="Gemini" className="h-4 w-4 object-contain" />
        <span className="text-[12px] font-medium tracking-wide">{modeloAtual.nome}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-3 w-3" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute top-full left-0 mt-2 z-50 min-w-[240px] rounded-xl border border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl shadow-2xl overflow-hidden"
          >
            <div className="p-1">
              {MODELOS_DISPONIVEIS.map((modelo) => {
                const isSelected = modelo.id === selectedModel;
                return (
                  <button
                    key={modelo.id}
                    type="button"
                    onClick={() => {
                      onModelChange(modelo.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-left group",
                      isSelected
                        ? "bg-[#cd0000]/10 text-zinc-100"
                        : "text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-200"
                    )}
                  >
                    <img
                      src="/gemini-logo.webp"
                      alt=""
                      className={cn(
                        "h-4 w-4 object-contain shrink-0 transition-all duration-200",
                        isSelected ? "opacity-100" : "opacity-40 group-hover:opacity-70"
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="text-[13px] font-medium leading-tight">{modelo.nome}</span>
                      <span className="text-[11px] text-zinc-500 leading-tight">{modelo.descricao}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// GenericDropdown Component
interface GenericDropdownProps {
  options: string[];
  selectedValue: string;
  onChange: (value: string) => void;
  icon: React.ReactNode;
  labelPrefix?: string;
  disabled?: boolean;
}
const GenericDropdown: React.FC<GenericDropdownProps> = ({ options, selectedValue, onChange, icon, labelPrefix = "", disabled }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        disabled={disabled}
        className={cn(
          "flex items-center gap-1.5 h-8 px-2.5 rounded-full transition-all duration-200 border",
          isOpen
            ? "bg-white/[0.08] border-white/20 text-zinc-200"
            : "bg-transparent border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.05]",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <span className="flex items-center justify-center text-zinc-400">
          {icon}
        </span>
        <span className="text-[12px] font-medium tracking-wide">
          {labelPrefix}{selectedValue}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-3 w-3" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute top-full left-0 mt-2 z-50 min-w-[160px] max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 rounded-xl border border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl shadow-2xl"
          >
            <div className="p-1">
              {options.map((option) => {
                const isSelected = option === selectedValue;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      onChange(option);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-150 text-left group",
                      isSelected
                        ? "bg-[#cd0000]/10 text-zinc-100"
                        : "text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-200"
                    )}
                  >
                    <div
                      className={cn(
                        "h-1.5 w-1.5 rounded-full shrink-0 transition-all duration-200",
                        isSelected
                          ? "bg-[#cd0000] shadow-[0_0_8px_rgba(205,0,0,0.5)]"
                          : "bg-zinc-700 group-hover:bg-zinc-500"
                      )}
                    />
                    <span className="text-[13px] font-medium leading-tight">{option}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main PromptInputBox Component
interface PromptInputBoxProps {
  value: string;
  onChange: (val: string) => void;
  onSend?: () => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
  selectedModel?: string;
  onModelChange?: (modelId: string) => void;
  tiposDisponiveis?: string[];
  estilosDisponiveis?: string[];
  selectedTipo?: string;
  onTipoChange?: (tipo: string) => void;
  selectedEstilo?: string;
  onEstiloChange?: (estilo: string) => void;
}
export const PromptInputBox = React.forwardRef((props: PromptInputBoxProps, ref: React.Ref<HTMLDivElement>) => {
  const {
    value,
    onChange,
    onSend = () => { },
    isLoading = false,
    placeholder = "Descreva o componente...",
    className,
    selectedModel = "gemini-3.1-flash-lite-preview",
    onModelChange,
    tiposDisponiveis = [],
    estilosDisponiveis = [],
    selectedTipo = "",
    onTipoChange,
    selectedEstilo = "",
    onEstiloChange
  } = props;
  const [files, setFiles] = React.useState<File[]>([]);
  const [filePreviews, setFilePreviews] = React.useState<{ [key: string]: string }>({});
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [isRecording, setIsRecording] = React.useState(false);
  const uploadInputRef = React.useRef<HTMLInputElement>(null);
  const promptBoxRef = React.useRef<HTMLDivElement>(null);


  const isImageFile = (file: File) => file.type.startsWith("image/");

  const processFile = (file: File) => {
    if (!isImageFile(file)) {
      console.log("Only image files are allowed");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      console.log("File too large (max 10MB)");
      return;
    }
    setFiles([file]);
    const reader = new FileReader();
    reader.onload = (e) => setFilePreviews({ [file.name]: e.target?.result as string });
    reader.readAsDataURL(file);
  };

  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const imageFiles = droppedFiles.filter((file) => isImageFile(file));
    if (imageFiles.length > 0) processFile(imageFiles[0]);
  }, []);

  const handleRemoveFile = (index: number) => {
    const fileToRemove = files[index];
    if (fileToRemove && filePreviews[fileToRemove.name]) {
      const newPreviews = { ...filePreviews };
      delete newPreviews[fileToRemove.name];
      setFilePreviews(newPreviews);
    }
    setFiles([]);
  };

  const openImageModal = (imageUrl: string) => setSelectedImage(imageUrl);

  const handlePaste = React.useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          e.preventDefault();
          processFile(file);
          break;
        }
      }
    }
  }, []);

  React.useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [handlePaste]);

  const handleSubmit = () => {
    if (value.trim() || files.length > 0) {
      onSend();
    }
  };

  const handleStartRecording = () => console.log("Started recording");

  const handleStopRecording = (duration: number) => {
    setIsRecording(false);
  };

  const hasContent = value.trim() !== "" || files.length > 0;

  return (
    <>
      <PromptInput
        value={value}
        onValueChange={onChange}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        className={cn(
          "w-full transition-all duration-500 ease-in-out group-focus-within/textarea:shadow-[0_0_40px_rgba(168,85,247,0.15)] group-focus-within/textarea:border-purple-500/50",
          isRecording && "border-red-500/70 shadow-[0_0_30px_rgba(239,68,68,0.2)]",
          className
        )}
        disabled={isLoading || isRecording}
        ref={ref || promptBoxRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {files.length > 0 && !isRecording && (
          <div className="flex flex-wrap gap-2 p-0 pb-1 transition-all duration-300">
            {files.map((file, index) => (
              <div key={index} className="relative group">
                {file.type.startsWith("image/") && filePreviews[file.name] && (
                  <div
                    className="w-16 h-16 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 border border-white/[0.05]"
                    onClick={() => openImageModal(filePreviews[file.name])}
                  >
                    <img
                      src={filePreviews[file.name]}
                      alt={file.name}
                      className="h-full w-full object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile(index);
                      }}
                      className="absolute top-1 right-1 rounded-full bg-black/70 p-0.5 opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div
          className={cn(
            "transition-all duration-300",
            isRecording ? "h-0 overflow-hidden opacity-0" : "opacity-100"
          )}
        >
          <PromptInputTextarea
            placeholder={placeholder}
            className="text-[15px] p-4"
          />
        </div>

        {isRecording && (
          <VoiceRecorder
            isRecording={isRecording}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
          />
        )}

        <PromptInputActions className="flex items-center justify-between gap-2 p-2 pt-0">
          <div
            className={cn(
              "flex items-center gap-1 transition-opacity duration-300",
              isRecording ? "opacity-0 invisible h-0" : "opacity-100 visible"
            )}
          >
            <PromptInputAction tooltip="Anexar imagem (Drag & Drop)">
              <button
                onClick={() => uploadInputRef.current?.click()}
                className="flex h-8 w-8 text-zinc-500 cursor-pointer items-center justify-center rounded-full transition-all hover:bg-white/[0.05] hover:text-zinc-300"
                disabled={isRecording}
              >
                <Paperclip className="h-4 w-4 transition-colors" />
                <input
                  ref={uploadInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) processFile(e.target.files[0]);
                    if (e.target) e.target.value = "";
                  }}
                  accept="image/*"
                />
              </button>
            </PromptInputAction>

            <CustomDivider />

            {tiposDisponiveis.length > 0 && onTipoChange && (
              <>
                <GenericDropdown
                  options={tiposDisponiveis}
                  selectedValue={selectedTipo}
                  onChange={onTipoChange}
                  icon={<LayoutTemplate className="h-3.5 w-3.5" />}
                  disabled={isLoading || isRecording}
                />
                <CustomDivider />
              </>
            )}

            {estilosDisponiveis.length > 0 && onEstiloChange && (
              <>
                <GenericDropdown
                  options={estilosDisponiveis}
                  selectedValue={selectedEstilo}
                  onChange={onEstiloChange}
                  icon={<Palette className="h-3.5 w-3.5" />}
                  disabled={isLoading || isRecording}
                />
                <CustomDivider />
              </>
            )}

            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={onModelChange || (() => { })}
              disabled={isLoading || isRecording}
            />
          </div>

          <PromptInputAction
            tooltip={
              isLoading
                ? "Parar"
                : isRecording
                  ? "Parar gravação"
                  : hasContent
                    ? "Enviar instrução"
                    : "Mensagem de voz"
            }
          >
            <Button
              variant="default"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-full transition-all duration-300",
                isRecording
                  ? "bg-transparent hover:bg-white/5 text-[#cd0000] shadow-none border border-[#cd0000]/30"
                  : hasContent
                    ? "bg-[#cd0000] hover:bg-[#a00000] text-white shadow-sm"
                    : "bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 shadow-none border border-white/[0.05]"
              )}
              onClick={() => {
                if (isRecording) setIsRecording(false);
                else if (hasContent) handleSubmit();
                else setIsRecording(true);
              }}
              disabled={isLoading && !hasContent}
            >
              {isLoading ? (
                <Square className="h-3.5 w-3.5 fill-white animate-pulse" />
              ) : isRecording ? (
                <StopCircle className="h-4 w-4 text-red-500" />
              ) : hasContent ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4 transition-colors" />
              )}
            </Button>
          </PromptInputAction>
        </PromptInputActions>
      </PromptInput>

      <ImageViewDialog imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
    </>
  );
});
PromptInputBox.displayName = "PromptInputBox";
