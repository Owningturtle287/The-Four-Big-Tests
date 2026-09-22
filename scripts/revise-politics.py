"""Reproducible, reviewed rewrites; original IDs and signed weights are retained."""
from pathlib import Path
import json, re

root = Path(__file__).resolve().parents[1]
source = root / 'docs/source/03_Political_Compass_101_App.html'
original = source.read_text()
items = json.loads(re.search(r'const ITEMS = (\[.*?\]);', original, re.S).group(1))
facets = json.loads(re.search(r'const FACETS = (\{.*?\});', original, re.S).group(1))
# Numbers define hypothetical policies, not claims about an actual jurisdiction.
rewrites = '''
Water distribution networks should be owned by a public authority rather than private shareholders, with charges covering maintenance and operating costs.
Publishing an opinion that insults a religion should remain legal when it contains no threat, incitement to violence, or targeted harassment.
A household earning five times the national median income should pay a higher effective income-tax rate than a household earning the median.
Police investigating a crime should obtain a warrant from an independent judge before reading a suspect's private messages, except to prevent an imminent threat to life.
An employer should be prohibited from dismissing or demoting a worker for organizing a lawful union, even when the employer opposes unionization.
Adults should be allowed to sell sexually explicit material to consenting adults, with safeguards against coercion and access by children.
Every resident should receive medically necessary hospital and primary care through a tax-funded public insurance plan, even if this increases taxes.
Emergency powers that bypass ordinary lawmaking should expire after 30 days unless the legislature votes to renew them.
A factory should pay for the independently measured air-pollution damage it causes, even when that raises its production costs.
Municipalities should set land-use rules when the effects stay within their boundaries, even if this produces different rules between neighboring towns.
Import tariffs should be removed when this lowers consumer prices overall, even if the government expects some domestic factories to close.
A citizen placed on a security no-fly list should be able to challenge the restriction before an independent judge within 14 days.
Employers and workers should be allowed to agree on pay outside an industry-wide union contract, provided they meet statutory labor protections.
A security agency should be allowed to collect and automatically analyze everyone's public social-media posts for terrorism risks, with oversight from a court whose proceedings are secret.
All households should pay the same percentage of income above a basic tax-free allowance, even if this redistributes less income than higher rates for higher earners.
Government should be allowed to prohibit peaceful political speech that it judges likely to increase hostility between social groups, even without a threat or incitement to violence.
In industries where several firms can compete without natural monopoly, businesses should normally be owned by private investors rather than the government.
An employer should be prohibited from firing someone for attending a lawful political rally outside work when it does not affect their job performance or workplace conduct.
A court should be able to revoke citizenship from a dual national convicted of a terrorism offense that caused deaths, provided the person retains another citizenship.
Government procurement should favor domestic semiconductor manufacturers over cheaper foreign suppliers to preserve domestic production capacity.
The national government should be able to impose the same minimum building-safety rules on every municipality, even when local voters prefer weaker rules.
If independent evidence shows two policies would reduce emissions equally, government should charge firms for their emissions rather than require a particular production technology.
During a declared emergency lasting more than 30 days, the executive should be able to extend its extraordinary powers without a legislative vote if it believes delay would worsen the crisis.
Residents should normally obtain basic health coverage from competing private insurers, with public subsidies for those who cannot afford premiums.
Government should be allowed to prohibit consensual sexual relationships between unrelated adults solely because the majority considers those relationships immoral.
Profits from selling investments held for more than a year should be taxed at a lower rate than wages of the same amount.
Military service should be voluntary unless the country faces an invasion that threatens its continued existence.
An employee-owned business should receive a lower corporate tax rate than an otherwise identical investor-owned business.
People should be allowed to publish political opinions under a pseudonym without registering their real identity with the government.
The portion of an inheritance exceeding 100 times the national median annual income should be subject to a separate inheritance tax.
Evidence obtained when police deliberately search a home without a required warrant should be excluded from a criminal trial, even if it proves guilt.
The legal minimum wage for full-time work should cover a locally defined basic living budget, even if credible estimates predict a small reduction in low-wage employment.
Two adults of the same sex should have the same legal right to civil marriage as two adults of different sexes.
Public schools in low-income neighborhoods should receive additional funding to narrow measured resource gaps with schools in wealthy neighborhoods.
An independent constitutional court should be able to strike down a law that violates constitutional rights, even when the law has majority voter support.
A regulator should be able to temporarily suspend sales of a product when credible evidence suggests it may cause fatal illness, while further testing establishes the size of the risk.
A social-media platform used by most adults should provide notice and a human-reviewed appeal when it removes lawful political speech for breaking its rules.
Citizens should be able to trigger a binding national referendum by collecting verified signatures from 5% of eligible voters, subject to constitutional review.
Wealth transferred at death should face no separate inheritance tax, even when an estate exceeds 100 times the national median annual income.
Organizers of a peaceful march that uses public streets should need government approval of the event, rather than only notifying officials so traffic can be managed.
Government should establish a publicly owned provider when a region has repeatedly been left without reliable broadband because private firms find it unprofitable.
Every young adult should complete six months of military or civilian public service, with exemptions for disability and substantial caregiving responsibilities.
A publicly owned development bank should fund long-term infrastructure projects with substantial public benefits even when commercial banks reject them as too risky.
Elected legislators should make final decisions on ordinary national laws instead of allowing those laws to be decided by binding citizen-initiated referendums.
A business should be allowed to continue selling a new product while regulators investigate possible harm, until evidence shows that significant harm is likely.
When a constitution does not explicitly protect the right at issue, judges should defer to an elected legislature rather than invalidate its law using broader constitutional principles.
Parents should be allowed to transfer their child's public-school funding to a licensed private school that meets the same academic and admissions standards.
A court should be able to order a lifesaving blood transfusion for a competent adult who understands the consequences and refuses it for personal beliefs.
Regional governments should set minimum wages according to local wages and living costs, without having to meet a single national wage floor.
When police have specific evidence of an imminent armed attack, they should be allowed to search a suspect's home without waiting for a warrant, with judicial review afterward.
All consumer loans should use legally standardized rules for fees and early repayment, even if this prevents lenders from offering some customized contracts.
A party receiving 10% of votes in a national legislative election should receive about 10% of seats, even if coalition governments become more common.
Private banks should decide which lawful businesses receive loans without government requirements to lend a specified share to favored industries.
Each person requesting asylum should receive an individual assessment and a chance to appeal rejection, even during a large surge in arrivals.
After meeting contracts, taxes, and minimum employment standards, a profitable company should decide how much of its remaining profit goes to shareholders rather than employees.
During a declared pandemic, government should be able to require factories to produce essential medical equipment at compensated rates for up to 90 days, with any extension requiring a legislative vote.
A peaceful organization that campaigns to replace democracy with a monarchy should remain legal as long as it does not plan or incite violence.
Government should guarantee every adult an income sufficient for a basic living budget through payments that decrease as earnings rise, even if this requires higher taxes.
A person arrested on suspicion of a crime should be able to consult a lawyer before police question them about the alleged offense.
Employees should elect one-third of the board members of large companies, even when employees do not own shares.
During an outbreak of a potentially fatal contagious disease, entry to crowded indoor public venues should require vaccination when strong evidence shows it substantially reduces transmission, with medical exemptions.
A tax-funded public pension should guarantee a basic retirement income regardless of how investments perform.
The officials who administer national elections should be appointed through a process requiring agreement from both governing and opposition parties, rather than by the government alone.
Government should sell a business it owns when a competitive private market can provide the same service at a similar price and quality.
An adult who crosses a border without authorization should be detained until their identity and claim are decided, even when authorities have found no individual flight or safety risk.
Urban land left unused for more than two years, despite permission to develop it, should face a higher property-tax rate than comparable land in active use.
Election rules should give the largest party a seat bonus to make a stable government more likely, even if smaller parties receive fewer seats than their vote shares justify.
Adults who pass a financial-knowledge assessment should be allowed to buy high-risk investments that ordinary consumer-protection rules would prohibit.
Eligible citizens should have to attend or return a ballot in national elections, with a small fine for nonparticipation without a valid excuse; submitting a blank ballot would remain allowed.
Retirement income should come mainly from individually owned investment accounts rather than a tax-funded pension guaranteeing a fixed basic benefit.
Parents should be allowed to homeschool their children when independent assessments show the children meet minimum academic standards.
An employer should be allowed to permanently replace workers after a lawful strike has lasted 30 days, even if the strike is continuing.
After a person completes a prison sentence, a court should be able to impose electronic monitoring based on evidence of a high risk of serious reoffending, with regular review and access to appeal.
Cash income support should be limited to households below a basic-needs threshold rather than paid to households at all income levels.
An employer should be allowed to ban religious headwear under a general uniform policy even when the headwear creates no safety problem and allowing it would cost little.
Government should be allowed to ban a political organization that seeks to end multiparty elections, even if it pursues its goals peacefully and lawfully.
Unemployment insurance should replace at least half of previous wages for six months, subject to a cap and active job search, even if payroll taxes must rise.
A security-cleared legislative committee should be able to inspect national-security operations in confidential hearings, even when the executive objects.
During a declared disaster, public agencies should be able to temporarily cap the retail price of basic drinking water, even if higher prices might attract additional suppliers.
A public school should permit religious clothing that does not interfere with safety or teaching, even if its usual uniform rules would prohibit it.
When signing a new lease, a landlord should be free to set the rent at any price a tenant accepts, without a government rent cap.
A person prosecuted for exposing an unlawful security program should be allowed to argue in court that the public benefit justified the disclosure, without an automatic guarantee of acquittal.
Government should be able to require divestment when one private group controls most major news outlets, even if its prices to consumers remain low.
Journalists should be allowed to publish evidence of government misconduct found in classified documents unless a court identifies a specific, serious threat to people's safety.
Reducing large differences in after-tax income should remain a goal of tax policy even after every household can meet its basic needs.
A defendant whom a judge finds unlikely to flee or harm others should not stay in jail before trial solely because they cannot afford a cash deposit.
A delivery worker who gets nearly all their income from one platform and must follow its pricing rules should receive employee-like minimum-pay and injury protections.
All schools, including private and home schools, should teach a national course on constitutional institutions and citizens' legal rights alongside basic academic subjects.
A dominant company should be split into separate businesses when it repeatedly blocks competitors from entering its market, even if current prices are low.
Public schools should apply the same dress rules to everyone rather than grant religious exemptions, even when an exemption would create no safety problem and cost little.
During a temporary shortage, sellers should be allowed to raise prices for essential goods in response to demand, provided they do not collude or deceive buyers.
An elected national leader should be able to dismiss senior career civil servants for refusing to support the leader's lawful policy program, without having to prove professional misconduct.
Adults should pay for routine dental care themselves or through private insurance, with targeted help for low-income patients, rather than receive it through a universal public program.
A municipality should be allowed to suspend a national shop-opening-hours rule when the effects of doing so remain within its boundaries.
Possession of a small quantity of a recreational drug for personal use should lead to a civil or health response rather than a criminal conviction; sale to others would remain separately regulated.
Employees and employers should be allowed to agree on overtime pay without a statutory overtime premium, provided working hours meet health and safety limits.
When a fixed prison budget cannot fund both, spending should prioritize preventing escapes over education and treatment programs intended to reduce reoffending.
When two tax reforms raise the same revenue, government should prefer the one expected to increase investment over the one expected to reduce after-tax income inequality.
The elected government should be allowed to direct which political issues a publicly funded broadcaster prioritizes in its news coverage.
Large differences in business ownership are acceptable when they arise from lawful investment and entrepreneurship, even if that concentrates substantial economic influence.
A security agency should be allowed to conceal an operation even from a security-cleared legislative oversight committee when the agency believes disclosure could endanger it.
'''.strip().splitlines()
assert len(rewrites) == len(items) == 101
notes = [
    '# Political Compass 101: item revision log',
    '',
    'Version 2.0. All 101 original IDs, facets, and signed weights are retained. Every statement has been reviewed and rewritten. Numerical thresholds describe hypothetical policies; they are not factual claims or empirically validated cutoffs.',
    '',
    'Changes make the actor, action, scope, exception, or tradeoff explicit. Some scenarios narrow the original construct substantially. The revised instrument therefore requires fresh validation. Original paired-item coherence is intentionally not presented as a reliability statistic: two context-dependent policy preferences need not agree.',
    '',
    'The result describes economic and governance preferences, not party membership. Original weighting choices are heuristic. Unanswered/context-dependent responses are omitted from the denominator; neutral responses remain zero. Scores are withheld when weighted coverage of either axis is below 70%.',
    ''
]
for item, text in zip(items, rewrites):
    notes += [f"## {item['id']} · {item['key']} · {item['facet']}", '', '**Original:** '+item['text'], '', '**Revised:** '+text, '']
    item['originalText'] = item['text']
    item['text'] = text
    item['id'] = item['key']
    item.pop('paired_with',None)
(root/'app/data/politics.js').write_text('export const POLITICAL_ITEMS = '+json.dumps(items,ensure_ascii=False,indent=2)+';\nexport const POLITICAL_FACETS = '+json.dumps(facets,indent=2)+';\n')
(root/'docs/POLITICAL_REVISIONS.md').write_text('\n'.join(notes))
print('Revised exactly 101 political items.')
