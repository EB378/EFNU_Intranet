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


//DevRoles

//SalesRoles

//LeadGenRoles

//LeadRoles
g, COO, ProejctManager
g, CEO, COO
g, Admin, CEO



//MISCRoles
g, admin, Test1
g, admin, Test2



//Policies  

p, admin, home, (list)|(show)
p, admin, atis, (list)|(show)
p, admin, priornotice, (list)|(show)|(create)
p, admin, fuel, (list)|(show)|(create)
p, admin, webcam, (list)|(show)
p, admin, blog, (list)|(show)|(create)
p, admin, notams, (list)|(show)
p, admin, info, (list)|(show)
p, admin, flyk, (list)|(show)
p, admin, weather, (list)|(show)
p, admin, lights, (list)|(show)
p, admin, profiles, (list)|(show)
p, admin, sms, (list)|(show)|(create)
p, admin, contact, (list)|(show)
p, admin, handbook, (list)|(show)
p, admin, rules, (list)|(show)
p, admin, pic, (list)|(show)

`);


