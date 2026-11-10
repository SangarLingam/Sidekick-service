import { Controller, Get, Injectable, Module } from '@nestjs/common';

export interface AgentSkill { id: string; name: string; description: string; service: string; requiredPermissions: string[]; tools: string[]; status: 'planned'|'enabled' }
@Injectable()
class SkillsService {
  // Registry is code-owned for the foundation phase; admin-managed persistence
  // and per-user scope are introduced with database/identity integration.
  list(): AgentSkill[] { return [
    { id:'knowledge-answer', name:'Knowledge Answers', description:'Answer from approved Markdown sources.', service:'knowledge', requiredPermissions:['knowledge.read'], tools:['search_documents'], status:'planned' },
    { id:'ticket-create', name:'Ticket Creation', description:'Create support tickets from user requests.', service:'tickets', requiredPermissions:['tickets.create'], tools:['create_ticket'], status:'enabled' },
    { id:'support-routing', name:'Support Routing', description:'Route users to configured support teams.', service:'calls', requiredPermissions:['support.contact'], tools:['route_support'], status:'planned' },
  ]; }
}
@Controller('skills') class SkillsController { constructor(private readonly skills: SkillsService) {} @Get() list() { return this.skills.list(); } }
@Module({ controllers:[SkillsController], providers:[SkillsService] }) export class SkillsModule {}
