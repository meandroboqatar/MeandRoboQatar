---
name: conversion
description: Implement consultation-first conversion system: forms, validation, WhatsApp button, success state, webhook stub.
disable-model-invocation: true
---
Implement lead capture:
- Form fields: Full name, Company, Industry dropdown, Phone, Email, Interested solution (multi-select), Message
- Validation + success state
- Submit to placeholder webhook URL; fallback mailto if webhook fails
- Add WhatsApp floating button sitewide; add click-to-call and mailto.

No pricing anywhere.
Verification:
- Form validates; submission success UI renders; build passes.