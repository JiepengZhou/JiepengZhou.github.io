# Ruby 3.2+ 移除了 taint API，liquid 4.0.3 仍会对任意对象调用 tainted?/taint/untaint
unless Object.method_defined?(:tainted?)
  class Object
    def tainted?
      false
    end
    def taint
      self
    end
    def untaint
      self
    end
  end
end
