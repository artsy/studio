# Libs

The `libs` directory is home to any code shared across studio applications.

As an example, to import the env helper from `utils`:

```typescript
import { env } from "libs/utils/env";
```

Being that the `utils` directory has a `index.ts` that exports `env` you could also just do

```typescript
import { env } from "libs/utils";
```

There's nothing really special here. Only add code here if you're sure it's needed across apps.
