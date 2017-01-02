package nl.cwi.reo.interpret;

public final class ProgramInstance implements Program {

	public final ComponentExpression cexpr;

	public final ExpressionList plist;
	
	private final Interface iface;

	public ProgramInstance(ComponentExpression cexpr, ExpressionList plist, 
			Interface iface) {
		if (cexpr == null || plist == null || iface == null)
			throw new IllegalArgumentException("Arguments cannot be null.");		
		this.cexpr = cexpr;
		this.plist = plist;
		this.iface = iface;
	}
	
	@Override
	public Program evaluate(DefinitionList params) throws Exception {
		
		ExpressionList parameters_p = plist.evaluate(params); 
		Interface intface_p = iface.evaluate(params); 
		
		ComponentExpression compexpr_p = cexpr.instantiate(parameters_p, intface_p); 
		
		if (compexpr_p instanceof ComponentValue)
			return new ProgramValue(((ComponentValue)compexpr_p).getInstance(), 
					new DefinitionList());
		
		return new ProgramInstance(cexpr, parameters_p, intface_p);
	}
	
}