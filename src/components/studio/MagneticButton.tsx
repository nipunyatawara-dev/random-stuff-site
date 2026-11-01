"use client";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
export type ButtonVariant='primary-light'|'primary-dark'|'accent-lime'|'ghost';
export interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { variant?:ButtonVariant;size?:'sm'|'md'|'lg';icon?:ReactNode;href?:string;target?:string;rel?:string;asChild?:boolean;magneticOptions?:unknown }
export function MagneticButton({children,variant='primary-light',icon,href,target,rel,className='',size,asChild,magneticOptions,...props}:MagneticButtonProps){
 void size;void asChild;void magneticOptions;
 const classes=`button ${variant==='accent-lime'?'button-primary':''} ${className}`;
 return href?<a {...props as AnchorHTMLAttributes<HTMLAnchorElement>} href={href} target={target} rel={target==='_blank'?rel||'noopener noreferrer':rel} className={classes}>{icon}{children}</a>:<button type="button" {...props} className={classes}>{icon}{children}</button>;
}
