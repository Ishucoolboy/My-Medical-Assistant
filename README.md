# My Medical Assistant

A clinic-focused web application for structured OPD documentation and inventory-aware decision support.

## Current foundation

- Responsive clinic dashboard
- Independent patient-case workflow
- Complaint, history, vitals/examination and red-flag fields
- Phase 1: oral/topical inventory section
- Phase 2: injection/IV fluid/respule section
- Inventory manager with local browser storage
- Recent-case browser history
- Referral/red-flag warning layer
- No definitive diagnosis language
- No medicine is invented by the app: inventory starts empty until verified medicines are loaded

## Safety design

This application is decision support, not a substitute for clinical examination, investigations, prescribing judgment, emergency care, or local protocols.

Medicine names, strengths, doses, routes and indications should be loaded from the clinic's verified inventory/reference material before clinical use.

## Run

This is a static web app. Open index.html in a browser or deploy the repository with GitHub Pages.

## Next development targets

1. Load the clinic's verified medicine inventory.
2. Add protocol/reference data as structured records.
3. Add a rules engine that matches complaints to verified protocols.
4. Add validated age/weight-aware dose calculations where source data is available.
5. Add authenticated cloud storage only if records need to persist across devices.
6. Add audit logging and role-based access before handling real patient-identifiable data.
