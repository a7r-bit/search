
import { CanActivate, ExecutionContext, Logger } from "@nestjs/common";
import { createClient } from "ldapjs";
/*
* Гвард для подключения к ldap серверу с помощью  
* переданных в request учетных данных 
* и получения его групп 
* 
*/

export class LdapGroupGuard implements CanActivate {
    private readonly logger = new Logger(LdapGroupGuard.name);

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            this.logger.warn("User object not found on request");
            return false;
        }

        this.logger.log(`✔ Checking group membership for user: ${user.uidNumber}`);

        const client = createClient({ url: `ldap://${process.env.LDAP_HOST}:${process.env.LDAP_PORT}` });

        return new Promise((resolve) => {
            client.bind(`${process.env.LDAP_ADMIN_DN}`, `${process.env.LDAP_ADMIN_PASSWORD}`, (err) => {
                if (err) {
                    this.logger.error("🚫 Failed to bind as LDAP admin", err.message);
                    return resolve(false);
                }
                this.logger.log("Successfully bound as LDAP admin");

                client.search(
                    'ou=groups,dc=mycompany,dc=local',

                    // { filter: `(gidNumber=${user.gidNumber})`, scope: 'sub', attributes: ['cn'] },
                    { filter: `(memberUid=${user.uidNumber})`, scope: 'sub', attributes: ['cn'] },
                    // {
                    //     filter: `(member=${user.dn})`, scope: 'sub', attributes: ['cn']
                    // },

                    (err, res) => {
                        if (err) {
                            this.logger.error("LDAP search error", err.message);
                            return resolve(false);
                        }

                        let found = false;
                        user.groups = [];

                        res.on('searchEntry', (entry) => {
                            const cnAttr = entry.attributes.find(attr => attr.type === 'cn');

                            const groupName = cnAttr?.buffers?.[0]?.toString();
                            if (groupName) {
                                user.groups.push(groupName);
                            }
                            found = true;
                        });



                        res.on('end', () => {
                            client.unbind();
                            if (!found) this.logger.warn("🚫 User not found in group");
                            resolve(found);
                        });
                    },
                );
            });
        });
    }
}
