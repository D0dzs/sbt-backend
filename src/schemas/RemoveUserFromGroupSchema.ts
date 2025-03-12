import { z } from "zod";

const RemoveUserFromGroupSchema = z.object({
  id: z.string({ required_error: "Felhasználó ID kötelező!" }),
  group: z.string({ required_error: "Csoport kötelező!" }),
  firstName: z.string({ required_error: "Vezetéknév kötelező!" }),
  lastName: z.string({ required_error: "Keresztnév kötelező!" }),
  isItSubGroup: z.boolean(),
});
type RemoveUserFromGroupSchema = z.infer<typeof RemoveUserFromGroupSchema>;

export default RemoveUserFromGroupSchema;
