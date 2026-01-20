"use client"

import * as React from "react"
import { ToastActionElement, type ToastProps } from "@/components/ui/toast"

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

type ToastFn = (props: Omit<ToasterToast, "id">) => { id: string }
type DismissFn = (id: string) => void
type UseToastReturn = {
  toasts: ToasterToast[]
  toast: ToastFn
  dismiss: DismissFn
}


const listeners = new Set<() => void>()
let _toasts: ToasterToast[] = []

function emit() {
  listeners.forEach((l) => l())
}

function addToast(t: Omit<ToasterToast, "id">): { id: string } {
  const id = Math.random().toString(36).slice(2)
  _toasts = [..._toasts, { ...t, id }]
  emit()
  return { id }
}

function removeToast(id: string) {
  _toasts = _toasts.filter((t) => t.id !== id)
  emit()
}


function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

export function useToast(): UseToastReturn {
  const toasts = React.useSyncExternalStore(
    subscribe,
    () => _toasts,
    () => _toasts
  )

  const toast = React.useCallback<ToastFn>((props) => addToast(props), [])
  const dismiss = React.useCallback<DismissFn>((id) => removeToast(id), [])

  return { toasts, toast, dismiss }
}
