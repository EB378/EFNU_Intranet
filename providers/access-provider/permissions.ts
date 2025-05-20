import { newModel, StringAdapter } from "casbin";

export const model = newModel(`
[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act  

[role_definition]
g = _, _

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
  m = g(r.sub, p.sub) && keyMatch(r.obj, p.obj) && regexMatch(r.act, p.act)

`);

export const adapter = new StringAdapter(`
//Roles
g, member, guest
g, admin, member
g, pilot, member


//Policies  

p, guest, home, (list)|(show)
p, guest, atis, (list)|(show)
p, guest, priornotice, (list)|(show)|(create)
p, guest, priornotice/*, (edit)|(delete) 
p, guest, notams, (list)|(show)
p, guest, info, (list)|(show)


p, member, fuel, (list)|(show)|(create)
p, member, webcam, (list)|(show)
p, member, flyk, (list)|(show)
p, member, weather, (list)|(show)
p, member, profile, (list)|(show)
p, member, profile/*, edit
p, member, lights, (list)|(show)


p, admin, users/*, (edit)|(delete)
p, admin, blog, (list)|(show)|(create)
p, admin, sms, (list)|(show)|(create)
p, admin, contact, (list)|(show)
p, admin, handbook, (list)|(show)
p, admin, rules, (list)|(show)
p, admin, pic, (list)|(show)
p, admin, admin, (list)|(show)
`);


