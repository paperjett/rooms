import { type ReactNode } from "react";
import clsx from "clsx";
import s from "./Button.module.css";

/**
 * Допустимые значения визуального варианта кнопки.
 * Здесь используется операция объединения(union -
 https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html)
 */
type ButtonVariant = "primary" | "secondary" | "third";
/** Допустимые размеры кнопки. */
type ButtonSize = "sm" | "md" | "lg";
/**
 * Пропсы кнопки.
 * - children: контент внутри (текст, иконка и пр.)
 * - variant/size: опциональные, с умолчаниями ("primary", "md")
 * - disabled: делает кнопку неактивной
 * - className: позволяет доклеить свои классы (например, от родителя)
 * - onClick: опциональный обработчик клика
 *
 * Опциональность достигается за счет указанного рядом с пропсом вопросительного
 знака
 */
interface ButtonProps {
    children: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    className?: string;
    onClick?: () => void; // при желании можно сузить до React.MouseEventHandler<HTMLButtonElement>
    startIcon?: ReactNode;
}
/**
 * Универсальная кнопка.
 * При помощи знака `=` сразу указываем значения "по умолчанию" для части
 параметров
 */
export function Button({
                           children,
                           variant = "primary", // дефолтный вариант
                           size = "md", // дефолтный размер
                           disabled = false, // по умолчанию кнопка активна
                           className,
                           onClick,
                           startIcon,
                       }: ButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={clsx( // Объединяем набор из нескольких стилей для кнопки
                s.button,
                s[variant], // s.primary или s.secondary
                s[size], // s.sm, s.md или s.lg
                disabled && s.disabled,
                className // внешний пользовательские классы, которые могут быть переданы с компонентом
                )}
        >
            {startIcon && <span className={s.startIcon}>{startIcon}</span>}
            {children}
        </button>
    );
}